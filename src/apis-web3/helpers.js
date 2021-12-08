require('dotenv').config();

const Web3 = require('web3');

const deGuildAddress = process.env.VUE_APP_DEGUILD_ADDRESS;

const deGuildABI = require('../../../DeGuild-MG-CS-Token-contracts/artifacts/contracts/DeGuild/V2/IDeGuild+.sol/IDeGuildPlus.json').abi;
const certificateABI = require('../../../DeGuild-MG-CS-Token-contracts/artifacts/contracts/SkillCertificates/V2/ISkillCertificate+.sol/ISkillCertificatePlus.json').abi;

const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');
const deGuild = new web3.eth.Contract(deGuildABI, deGuildAddress);
const noImg = require('@/assets/no-url.jpg');
/**
     * Returns a calculated date with `days` days added
     *
     * @param {int} date timestamp in linux machine
     * @param {int} days number of days
     * @return {Date} displayable skills.
     */
function addDays(date, days) {
  const result = new Date(date * 1000);
  result.setDate(result.getDate() + days);
  return result;
}
/**
     * Returns a thumbnail url from firebase storage
     *
     * @param {string} url url of the image
     * @return {string} url of the thumbnail.
     */
function thumbThis(url) {
  const original = url.slice(0, 80);
  const file = url.slice(80);
  return `${original}thumb_${file}`;
}

export async function fetchSkills(addresses, tokenIds) {
  const skillsOnChain = [];
  for (let index = 0; index < addresses.length; index += 1) {
    const address = addresses[index];
    tokenIds[index].forEach((id) => skillsOnChain.push([address, id]));
  }
  const displayableSkills = await Promise.all(
    skillsOnChain.map(async (pair) => {
      const manager = new web3.eth.Contract(certificateABI, pair[0]);
      const URI = await manager.methods.tokenURI(pair[1]).call();
      const response = await fetch(URI, { mode: 'cors' });
      const caller = await manager.methods.shop().call();
      const shop = new web3.eth.Contract(certificateABI, caller);
      const shopCaller = await shop.methods.name().call();
      const data = await response.json();

      return {
        name: data.title,
        image: thumbThis(data.url),
        address: data.address,
        tokenId: data.tokenId,
        shopName: shopCaller,
        added: false,
      };
    }),
  );

  return displayableSkills;
}

export /**
* Returns a combined data from on-chain and off-chain to further display in the website
*
* @param {string} tokenId tokenId of job
* @param {string} blockNumber
* @return {Object} synced data of a job.
*/
async function idToJob(tokenId, blockNumber) {
  try {
    const infoOnChain = await deGuild.methods.jobInfo(tokenId).call();
    const URI = await deGuild.methods.jobURI(tokenId).call();
    const responseOffChain = await fetch(URI, { mode: 'cors' });
    const infoOffChain = await responseOffChain.json();
    const skillsFetched = await fetchSkills(infoOnChain[3], infoOnChain[4]);
    const block = await web3.eth.getBlock(blockNumber);
    const clientProfile = await fetch(
      `https://us-central1-deguild-2021.cloudfunctions.net/app/readProfile/${web3.utils.toChecksumAddress(
        infoOnChain[1],
      )}`,
      { mode: 'cors' },
    );
    let info = {
      name: 'Unknown',
      url: noImg,
    };
    if (clientProfile.status === 200) {
      info = await clientProfile.json();
      info.url = `${info.url.slice(0, 125)}thumb_${info.url.slice(125)}`;
    }
    const { timestamp } = block;
    const jobObject = {
      id: tokenId,
      time: infoOffChain.time,
      reward: web3.utils.fromWei(infoOnChain[0]),
      client: infoOnChain[1],
      clientName: info.name,
      taker: infoOnChain[2],
      skills: skillsFetched,
      state: parseInt(infoOnChain[5], 10),
      difficulty: infoOnChain[6],
      level: parseInt(infoOffChain.level, 10),
      image: info.url,
      title: infoOffChain.title,
      note: infoOffChain.note,
      submission: infoOffChain.submission,
      description: infoOffChain.description,
      submitted: infoOffChain.submission.length > 0,
      deadline: addDays(timestamp, 7),
      status:
       infoOffChain.submission.length > 0 ? 'Submitted' : 'No submission',
    };

    return jobObject;
  } catch (err) {
    return {};
  }
}
