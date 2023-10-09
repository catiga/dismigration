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

  const [cutOffTs, setCutOffTs] = useState('-')

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

    const date = new Date(Number(endTs) * 1000);  // 将秒时间戳转换为毫秒
    const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    console.log(formattedDate);
    setCutOffTs(formattedDate)

    const chainLockerDis = selectChain(56)
    const disLocker = new web3Bsc.eth.Contract(chainLockerDis.abi, chainLockerDis.address)
    const disTotalSupply = await disLocker.methods.totalSupply().call()
    setDisTotal(disTotalSupply)
  }

  const handleInputPledgeEthf = async() => {
    const gasPrice = '15000000000000000'
    if(BigNumber.from(ethfBalance) <= BigNumber.from(gasPrice)) {
     return 
    }
    const loadBal = ((BigNumber.from(ethfBalance) - BigNumber.from(gasPrice)) / BigNumber.from(dec)).toFixed(4)
    setPledgeEthf(loadBal)
  }

  const handleInputPledgeDis = async() => {
    if(BigNumber.from(disBalance) == BigNumber.from(0)) {
     return 
    }
    const loadBal = ((BigNumber.from(disBalance)) / BigNumber.from(dec)).toFixed(4)
    setPledgeDis(loadBal)
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
      <div className='title'>Migration</div> 
      <div className='info'>
        <div>Why migration ETHF and DIS?</div>
        <div>Both ETHF and DIS will release currency exchange contracts. The currency exchange contract is a token distribution on the new main network. The address holding ETHF needs to pledge the tokens to the currency exchange contract of ETHF. The address holding Dis needs to transfer the tokens. The currency is pledged to the currency exchange contract of Dis.</div>
      </div>
      <div className='d-flex'>
        <div className='migration-data'>
          <div className='name'>ETHF migration value</div>
          <div className='value'>{ (BigNumber.from(ethfTotal) / BigNumber.from(dec)).toFixed(4) }</div>
        </div>
        <div className='migration-data'>
          <div className='name'>DIS Token migration value</div>
          <div className='value'>{ (BigNumber.from(disTotal) / BigNumber.from(dec)).toFixed(4) }</div>
        </div>
        <div className='migration-data'>
          <div className='name'>Rewards of token migration DIS/ETHF (day)*</div>
          <div className='value'>27,397</div>
        </div>
      </div>
      <div className='migration-content'>
        <div className='migration-item-wrap d-flex'>
          <div className='item'>
            <div className='name'>ETHF</div>
            <div className='value'>
              <Image size={48} src={ETHFLogo} />
            </div>
          </div>
          <div className='item'>
            <div className='name'>Rewards</div>
            <div className='value'>27,397</div>
          </div>
          <div className='item'>
            <div className='name'>Wallet Balance</div>
            <div className='value'>{ (BigNumber.from(ethfBalance) / BigNumber.from(dec)).toFixed(4) } ETHF</div>
          </div>
        </div>
        <div className='migration-item-wrap d-flex'>
          <div className='item'>
            <div className='name'>DIS</div>
            <div className='value'>
              <Image size={48} src={DISLogo} />
            </div>
          </div>
          <div className='item'>
            <div className='name'>Rewards</div>
            <div className='value'>27,397</div>
          </div>
          <div className='item'>
            <div className='name'>Wallet Balance</div>
            <div className='value'>{ (BigNumber.from(disBalance) / BigNumber.from(dec)).toFixed(4) } DIS</div>
          </div>
        </div>
        <div className='migration-item-wrap d-flex migration-item-wrap-last'>
          <div className='item'>
            <div className='name'>Migration ETHF</div>
            <div className='value'>
              <span className='color-blue'>{ (BigNumber.from(ethfDeposit) / BigNumber.from(dec)).toFixed(4) }</span>
              <span>{ (BigNumber.from(ethfReward) / BigNumber.from(dec)).toFixed(4) }</span>
            </div>
          </div>
          
          <div className='item item-end'>
            <div className='item-input-box'>
              <input placeholder='Pledge Quantity' value={pledgeEthf} onChange={e => setPledgeEthf(e.target.value)} type='number'/>
              <button onClick={() => {handleInputPledgeEthf()}}>Max</button>
            </div>
            <Button label="Start Now" size="small" style="primary" onClick = {() => handleStakeEthf()}/>
            {/* <Button label="Withdraw Now" size="small" style="primary" onClick = {() => handleWithdraw()}/> */}
          </div>
        </div>
        <div className='migration-item-wrap d-flex migration-item-wrap-last'>
          <div className='item'>
            <div className='name'>Migration  DIS</div>
            <div className='value'>
              <span className='color-blue'>{ (BigNumber.from(disDeposit) / BigNumber.from(dec)).toFixed(4) }</span>
              <span>{ (BigNumber.from(disReward) / BigNumber.from(dec)).toFixed(4) }</span>
            </div>
          </div>
          
          <div className='item item-end'>
            <div className='item-input-box'>
              <input placeholder='Pledge Quantity' value={pledgeDis} onChange={e => setPledgeDis(e.target.value)} type='number'/>
              <button onClick={() => {handleInputPledgeDis()}}>Max</button>
            </div>
            <Button label="Start Now" size="small" style="primary" onClick = {() => handleStakeDis()}/>
          </div>
        </div>
        <div className='migration-item-wrap d-flex migration-item-wrap-full migration-item-wrap-last'>
          <div className='item'>
            <div className='name'>Claimable ETHF</div>
            <div className='value'>
              <span className='color-blue'>0</span>
              <span>$0</span>
            </div>
          </div>
          
          <div className='item'>
            <Button label="Claim" size="small" style="default" />
          </div>
        </div>
        <div className='migration-item-wrap d-flex migration-item-wrap-full migration-item-wrap-last'>
          <div className='item'>
            <div className='name'>Cutoff block Time</div>
            <div className='value'>
              <span>{cutOffTs}</span>
            </div>
          </div>
        </div>
      </div>
    </MigrationContanier>
  )
}
const MigrationContanier = styled.div`
  margin: 171px auto 0;
  position: relative;
  max-width: 1296px;
  padding-bottom: 94px;
  .title {
    font-family: PingFang-SC-Heavy;
    font-size: 36px;
    letter-spacing: 0px;
    color: #3e445b;
    margin-bottom: 15px;
  }
  .info {
    font-family: PingFang-SC-Medium;
    font-size: 14px;
    line-height: 25px;
    letter-spacing: 0px;
    color: #54595f;
    margin-bottom: 34px;
  }
  .migration-content {
    width: 1301px;
    background-color: #fafafc;
    border-radius: 30px;
    padding: 40px 40px 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 39px;
  }
  .migration-data {
    margin-right: 83px;
    .name {
      font-family: PingFang-SC-Heavy;
      font-size: 16px;
      line-height: 4px;
      letter-spacing: 0px;
      color: #000000;
      margin-bottom: 10px;
    }
    .value {
      font-family: PingFang-SC-Heavy;
      font-size: 40px;
      letter-spacing: 0px;
      color: #1559ed;
    }
  }
  .migration-item-wrap {
    width: 581px;
    height: 125px;
    padding: 6px 38px 20px;
    background-color: #ffffff;
    border-radius: 30px;
    border: solid 1px #d5d8dc;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    &-last {
      padding: 0 38px;
    }
    &-full {
      width: 100%
    }
    .color-blue {
      font-size: 32px;
      margin-right: 20px;
    }
    .item-input-box {
      display: flex;
      align-items: center;
      font-size: 14px;
      margin-bottom: 12px;
      > input {
        flex: 1;
        border: 1px solid #d5d8dc;
        padding: 6px 12px;
        border-radius: 60px 0 0 60px;
      }
      > button {
        width: 50px;
        background: #1868dc;
        color: #fff;
        align-self: stretch;
        border-radius: 0 60px 60px 0;
        cursor: pointer;
      }
    }
    .item {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .name {
        font-size: 24px;
        line-height: 49px;
        letter-spacing: 0px;
        color: #3e445b;
      }
      &.item-end {
        align-items: flex-end;
      }
      &:not(:first-child) {
        .name {
          font-size: 16px;
        }
        .value {
          font-size: 28px;
        }
      }
    }
    &:last-child {
      .name {
        font-size: 16px;
      }
      .value {
        font-size: 28px;
      }
    }
  }
`