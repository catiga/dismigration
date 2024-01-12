import { Image } from '../../component'
import styled, { css } from 'styled-components'
import Button from '../../component/Button'
import { useEffect, useState } from 'react'
import useGlobal from "../../hooks/useGlobal";
import Web3 from 'web3';
import { BigNumber } from 'ethers';
import { TOKEN_ABI } from '../../abi/index'
import { selectChain } from '../../data/lockde'
import Toast from '../../component/Toast';
import Modal from '../../component/Modal';
import Loading from '../../component/LoadingOutlined';

const ethfRpcProvider = "https://rpc.dischain.xyz/"
const bscRpcProvider = "https://bsc-dataseed3.ninicoin.io"

const dec = "1000000000000000000"
const disAddress = '0xB0CA66Dd744b640a44AA690749BC3c3fC3ECa43A'
const startTs = 1697040000
const web3Ethf = new Web3(new Web3.providers.HttpProvider(ethfRpcProvider));

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
  const [rewardTotal, setRewardTotal] = useState(BigNumber.from(0))

  const [pledgeEthf, setPledgeEthf] = useState('')
  const [pledgeDis, setPledgeDis] = useState('')
  const [withdrawDis, setWithdrawDis] = useState('')
  const [toastMessage, setToastMessage] = useState('')
  const [showToast, setShowToast] = useState(false);
  const [blockNumber, setBlockNumber] = useState('');
  const [pledgeLoading, setPledgeLoading] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [showModal, setShowModal] = useState(false)

  const [ethfCutOffTs, setEthfCutOffTs] = useState(0)

  const numberWithCommas = (x) => {
    const parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }

  const handleBalance = async (account) => {
    const balanceEthfWei = await web3Ethf.eth.getBalance(account)

    // const ethfLocker = new web3Ethf.eth.Contract(TOKEN_ABI, disAddress)
    // const depositEthfWei = await ethfLocker.methods.balanceOf(account).call()
    // console.log('balanceOf>>', depositEthfWei)
    setDisBalance(balanceEthfWei)
  }

  const handleDeposit = async (account) => {
    const ethfLocker = new web3Ethf.eth.Contract(TOKEN_ABI, disAddress)
    const depositEthfWei = await ethfLocker.methods.deposits(account).call()
    console.log('deposits>>', depositEthfWei)
    setDisDeposit(depositEthfWei)
  }

  const handleEthfReward = async (account) => {
    // const web3Ethf = new Web3(new Web3.providers.HttpProvider(ethfRpcProvider));
    const chainLocker = selectChain(513100)
    const ethfLocker = new web3Ethf.eth.Contract(chainLocker.abi, chainLocker.address)

    const rewardEthfWei = await ethfLocker.methods.earned(account).call()

    setEthfReward(rewardEthfWei)

    const ts = await ethfLocker.methods.lastStakeTime(accounts[0]).call()
    const timerange = Math.floor(new Date().getTime() / 1000) - Number(ts)
    setLastApplyTs(timerange)
  }

  const handleDisReward = async (account) => {
    const disLocker = new web3Ethf.eth.Contract(TOKEN_ABI, disAddress)
    const rewardDisWei = await disLocker.methods.earned(account).call()
    setDisReward(rewardDisWei)
  }

  const handleTotalSupply = async () => {
    const ethfLocker = new web3Ethf.eth.Contract(TOKEN_ABI, disAddress)
    const ethfTotalSupply = await ethfLocker.methods.totalSupply().call()
    setEthfTotal(ethfTotalSupply)

    const endTs = await ethfLocker.methods.offBlockTs().call()
    setEthfCutOffTs(Number(endTs))
    setDisTotal(Number(endTs))

    const disTotalSupply = await ethfLocker.methods.totalSupply().call()
    console.log('totalSupply>>', disTotalSupply)
    setDisTotal(disTotalSupply)
  }

  const getTotalRewards = async () => {
    const ethfLocker = new web3Ethf.eth.Contract(TOKEN_ABI, disAddress)
    const rewardTotal = await ethfLocker.methods.rewardPerTokenStored().call()
    setRewardTotal(rewardTotal)
  }

  const getBlockNumber = async() => {
    const ethfLocker = new web3Ethf.eth.Contract(TOKEN_ABI, disAddress)
    const blockNumber = await ethfLocker.methods.onStartBlock().call()
    setBlockNumber(blockNumber.toString())
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

  const handleInputPledgeEthf = async () => {
    const gasPrice = '15000000000000000'
    if (BigNumber.from(ethfBalance).lte(BigNumber.from(gasPrice))) {
      return
    }
    const loadBal = ((BigNumber.from(ethfBalance) - BigNumber.from(gasPrice)) / BigNumber.from(dec))//.toFixed(4)
    console.log('huoqubalance:', loadBal, truncateBigNumber(loadBal, 4))
    // setPledgeEthf(loadBal)
    setPledgeEthf(truncateBigNumber(loadBal, 4))
  }

  const handleInputPledgeDis = async () => {
    if (BigNumber.from(disBalance) == BigNumber.from(0)) {
      return
    }
    const loadBal = ((BigNumber.from(disBalance)) / BigNumber.from(dec))//.toFixed(4)

    setPledgeDis(truncateBigNumber(loadBal, 4))
  }
  
  const handleInputWithdrawDis = async () => {
    if (BigNumber.from(disDeposit) == BigNumber.from(0)) {
      return
    }
    const loadBal = ((BigNumber.from(disDeposit)) / BigNumber.from(dec))//.toFixed(4)
  
    setWithdrawDis(truncateBigNumber(loadBal, 4))
  }

  const handleStakeEthf = async () => {
    if (!accounts || !pledgeEthf) {
      //提示连接钱包
      return
    }

    const web3 = new Web3(window.ethereum)
    const currentNetwork = await web3.eth.net.getId()

    let moveon = false
    if (currentNetwork != 513100) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: 0x7d44c }]
        })
        moveon = true
      } catch (e) {
        if ((e).code === 4902) {
          try {
            await (window.ethereum).request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: 0x7d44c,
                chainName: 'EthereumFair',
                nativeCurrency: {
                  name: 'DIS',
                  symbol: 'DIS',
                  decimals: 18
                },
                rpcUrls: [ethfRpcProvider]
              }]
            })
          } catch (ee) { }
        }
      }
    } else {
      moveon = true
    }
    if (moveon) {
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
          if (Number(receipt.status) == 1) {
            handleDeposit(accounts[0])
            handleTotalSupply()
          }
        }).on('error', (error) => {
          console.log('error', error)
        })
        await transaction;
      } catch (e) {
      }
    }
  }

  const handleStakeDis = async () => {
    if (!accounts) {
      handleToast('Please Connect Wallet')
      return
    }
    if (!pledgeDis) {
      handleToast('Please enter the $DIS to stake.')
      return
    }

    if (!window.ethereum) {
      return console.log('没连接钱包')
    }

    if (!!pledgeLoading) return;

    setPledgeLoading(true)
    const web3 = new Web3(window.ethereum)
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const currentNetwork = await web3.eth.net.getId()

    let moveon = false
    
    if (currentNetwork != 513100) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0x7d44c',
              chainName: 'DIS',  // 替换为您的链的名称
              nativeCurrency: {
                name: 'DIS',
                symbol: 'DIS',
                decimals: 18,
              },
              rpcUrls: ['https://rpc.dischain.xyz'],  // 替换为您的链的RPC URL
              blockExplorerUrls: ['https://explorer.dischain.xyz'],  // 替换为您的链的区块浏览器 URL
            },
          ],
        })
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x7d44c' }]
        })
        moveon = true
      } catch (e) {
        setPledgeLoading(false)
        if ((e).code === 4902) {
          try {
            await (window.ethereum).request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x7d44c',
                chainName: 'Binance Smart Chain',
                nativeCurrency: {
                  name: 'BNB',
                  symbol: 'BNB',
                  decimals: 18
                },
                rpcUrls: [bscRpcProvider]
              }]
            })
          } catch (ee) { 
            setPledgeLoading(false)
          }
        }
      }
    } else {
      moveon = true
    }

    if (moveon) {
      const pledgeDisWei = web3.utils.toWei(pledgeDis, "ether")
      const disLocker = new web3.eth.Contract(TOKEN_ABI, disAddress)
      const calldata = disLocker.methods.stakeAndReward(pledgeDisWei).encodeABI()
      
      try {

        const transaction = await disLocker.methods.stakeAndReward(pledgeDisWei).send({
          from: accounts[0],
          gas: 300000,
          data: calldata,
          value: pledgeDisWei,
        })
        console.log('transaction>', transaction)
        
        try {
          setPledgeLoading(false)
          if (Number(transaction.status) == 1) {
            handleDeposit(accounts[0]);
            handleTotalSupply();
          }
        } catch (error) {
          console.log('Error:', error);
          setPledgeLoading(false)
        }

      } catch(error) {
        console.log('e::>', error)
        setPledgeLoading(false)
        handleToast(error.data?.message)
      }
    }
  }

  const handleToast = (message) => {
    setToastMessage(message)
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000); // Toast显示3秒后自动隐藏
  }

  const handleWithdraw = async () => {

    if (!accounts) {
      handleToast('Please Connect Wallet')
      return
    }

    const loadBal = ((BigNumber.from(disDeposit)) / BigNumber.from(dec))//.toFixed(4)
    if (loadBal <= 0) {
      return handleToast('Deposited 0 $DIS')
    }

    if (!!!withdrawDis) {
      handleToast('Please enter the $DIS to withdraw.')
      return
    }

    if (!window.ethereum) {
      return console.log('没连接钱包')
    }

    if (!!withdrawLoading) return;

    setWithdrawLoading(true)
    const web3 = new Web3(window.ethereum)
    const withdrawDisWei = web3.utils.toWei(withdrawDis, "ether")
    const contract = new web3.eth.Contract(TOKEN_ABI, disAddress)
    const calldata = contract.methods.withdraw(withdrawDisWei).encodeABI()

    let trObj = {
      from: accounts[0],
      gas: 300000,
      data: calldata,
    }
    
    try {

      let gase = await contract.methods.withdraw(withdrawDisWei).estimateGas(trObj)
      console.log("gase: ", gase)

      contract.methods.withdraw(withdrawDisWei).send({
        from: accounts[0],
        gas: 300000,
        data: calldata,
      }).on('receipt', (r) => {
        console.log("result:", r)
        setWithdrawLoading(false)
      }).on('error', (error) => {
        console.log('error', error)
        setWithdrawLoading(false)
      })

    } catch(error) {

      console.log("err: ", trObj)
      setWithdrawLoading(false)
      handleToast(error.data?.message || error.message)

    }

  }

  const handleWithdrawAll = async () => {
    if (!accounts) {
      handleToast('Please Connect Wallet')
      return
    }
    const loadBal = ((BigNumber.from(disDeposit)) / BigNumber.from(dec))//.toFixed(4)
    if (loadBal <= 0) {
      return handleToast('Deposited 0 $DIS')
    }
    const web3 = new Web3(window.ethereum)
    const contract = new web3.eth.Contract(TOKEN_ABI, disAddress)
    const calldata = contract.methods.withdrawAll().encodeABI()

    try {

      const trObj = {
        from: accounts[0],
        gas: 300000,
        data: calldata,
      }

      let gase = await contract.methods.withdrawAll().estimateGas(trObj)

      const r = await contract.methods.withdrawAll().send({
        from: accounts[0],
        gas: gase,
        data: calldata,
      });
    } catch(err) {
      console.log('>>>r:', err)
      handleToast(err.data?.message || err.message)
    }
  }

  const handleWithdrawRewards = async () => {
    if (!accounts) {
      handleToast('Please Connect Wallet')
      return
    }

    // 用户无奖励
    const loadBal = ((BigNumber.from(disReward)) / BigNumber.from(dec))//.toFixed(4)
    if (loadBal <= 0) {
      return handleToast('You don\'t have $DIS reward.')
    }

    // 质押池奖励不够
    const userDisReward = ((BigNumber.from(disReward)) / BigNumber.from(dec))
    const totalDis = (BigNumber.from(disTotal) / BigNumber.from(dec))
    if (userDisReward > totalDis ) {
      return handleToast('Sorry, not enough $DIS.')
    }

    const web3 = new Web3(window.ethereum)
    const contract = new web3.eth.Contract(TOKEN_ABI, disAddress)
    const calldata = contract.methods.getReward().encodeABI()

    try {
      let tr = {
        from: accounts[0],
        gas: 300000,
        data: calldata,
      }
      const gas = await contract.methods.getReward().estimateGas(tr)

      const r = await contract.methods.getReward().send({
        from: accounts[0],
        gas: 300000,
        data: calldata,
      });
    } catch(err) {
      console.log('>>>r:', err)
      handleToast(err.data?.message || err.message)
    }

  }

  useEffect(() => {
    if (accounts && accounts[0]) {
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
    getTotalRewards()
    getBlockNumber()

    // const intervalBlock = setInterval(() => {
    //   getBlockNumber()
    // }, 2000);

    // return () => clearInterval(intervalBlock);
  }, [accounts])

  return (
    <MigrationContanier>

      <div className='w-[1000px] leading-[1.2]'>
        <h1 className='text-2xl font-cs'>$DIS Staking Mining</h1>
        <p className='text-sm my-2'>Why to Join Mine by Staking?</p>
        <p className='text-sm'>Discover the rewarding world of $DIS, the native coin of Disney Chain, a POW public blockchain where miners can engage in mining operations to earn $DIS tokens. Not just for miners, $DIS holders can also participate in the network by staking their coins, joining the mining process, and reaping rewards. With a steady generation of 0.3171 $DIS per second, entering the Disney Chain ecosystem is not only a venture into a robust POW platform but also an opportunity to share in the ongoing distribution of rewards. Secure your spot in this lucrative mining landscape by acquiring $DIS and staking to earn your share of the digital bounty. Join us and become a part of the Disney Chain community, where your contribution is valued and rewarded every second!</p>
      </div>

      <div className='text-gray-300 w-[1000px] mx-auto font-cm text-base flex items-center'>
        <h1>Wallet Balance: { accounts ? <span>{ (BigNumber.from(disBalance) / BigNumber.from(dec)).toFixed(4) } DIS</span> : <span>--.--</span> }</h1>
        <h1 style={{'marginLeft': 'auto'}}>Start Block: {blockNumber || ' loading...'}</h1>
      </div>
      <InnerContainer className='font-cm'>

        <InnerTop>
          <TitleText>$DIS total stake</TitleText>
          <HolderScore>{numberWithCommas((BigNumber.from(disTotal) / BigNumber.from(dec)).toFixed(4))}</HolderScore>
        </InnerTop>

        <InnerBottom>

          <InnerBottomItem>
            <TitleText>Reward token stored</TitleText>
            <SecondScore>{(BigNumber.from(rewardTotal) / BigNumber.from(dec)).toFixed(4)}</SecondScore>
            {/* <DescriptionText>DIS/ETHF (day)*</DescriptionText> */}
          </InnerBottomItem>

          <InnerBottomItem style={{'borderLeft': '1px solid #1559ed', 'borderRight': '1px solid #1559ed'}}>
            <TitleText>$DIS Deposited</TitleText>
            {
              accounts
                ? <SecondScore>{(BigNumber.from(disDeposit) / BigNumber.from(dec)).toFixed(4)}</SecondScore>
                : <SecondScore>--.--</SecondScore>
              }
            <DefaultButton onClick={() => handleWithdrawAll()}>Withdraw All</DefaultButton>
          </InnerBottomItem>

          <InnerBottomItem>
            <TitleText>$DIS Earned</TitleText>
            {
              accounts
              ? <SecondScore>{(BigNumber.from(disReward) / BigNumber.from(dec)).toFixed(4)}</SecondScore>
              : <SecondScore>--.--</SecondScore>
            }
            <DefaultButton onClick={() => handleWithdrawRewards()}>Get Reward</DefaultButton>
          </InnerBottomItem>

        </InnerBottom>

        <BalanceContainer>
          <WithdrawContainer>
            <TitleText>Deposit</TitleText>
            <div className='flex items-center gap-4'>
              <div className='input-box flex items-center'>
                <input placeholder='Pledge Quantity' value={pledgeDis} onChange={e => setPledgeDis(e.target.value)} type='number' />
                <button className='button-max' onClick={() => { handleInputPledgeDis() }}>max</button>
              </div>
              <ClipButton className='font-cs' onClick={() => handleStakeDis()}>
                {
                  pledgeLoading 
                    ? <Loading/>
                    : ''
                }
                Pledge
              </ClipButton>
            </div>
          </WithdrawContainer>
          <WithdrawContainer style={{'borderLeft': '1px solid #1559ed'}}>
            <TitleText>Withdraw</TitleText>
            <div className='flex items-center gap-4'>
              <div className='input-box flex items-center'>
                <input placeholder='Withdraw Quantity' value={withdrawDis} onChange={e => setWithdrawDis(e.target.value)} type='number' />
                <button className='button-max' onClick={() => { handleInputWithdrawDis() }}>max</button>
              </div>
              <ClipButton className='font-cs' onClick={() => handleWithdraw()}>
                {
                  withdrawLoading 
                    ? <Loading/>
                    : ''
                }
                Withdraw
              </ClipButton>
            </div>
          </WithdrawContainer>
        </BalanceContainer>

      </InnerContainer>

      <Toast showToast={showToast} message={toastMessage} />

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
  gap: 30px;

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
`

const InnerContainer = styled.div`
  --color: #1559ed;
  width: 1000px;
  margin: 0 auto;
  border: 1px solid var(--color);
  border-radius: 4px;
`

const InnerTop = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  .subtitle {
    font-size: 14px;
  }
`

const TitleText = styled.div`
  font-size: 20px;
  color: #929292;
`

const DescriptionText = styled.div`
  color: #929292;
`

const InnerBottom = styled.div`
  --color: #1559ed;
  display: flex;
  align-items: stretch;
  border-top: 1px solid var(--color);
`

const InnerBottomItem = styled.div.attrs(props => ({
  className: `${props.customClass || ''}`,
}))`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
`

const HolderScore = styled.div`
  --color: #1559ed;
  color: var(--color);
  font-size: 44px;
`

const SecondScore = styled.div`
  font-size: 20px;
  color: #d9d9d9;
  margin: 10px 0;
`

const DefaultButton = styled.div`
  --color: #1559ed;
  background: var(--color);
  font-size: 12px;
  color: black;
  border-radius: 4px;
  padding: 5px 12px;
  cursor: pointer;
`

const ClipButton = styled.button`
  --color: #1559ed;
  background: var(--color);
  line-height: 1.2;
  font-size: 13px;
  padding: 8px 23px;
  color: black;
  border-radius: 4px;
  clip-path: polygon(20px 0,100% 0,100% 50%,calc(100% - 20px) 100%,0 100%,0 50%);
  transition: all .3s;
  margin-top: 20px;
  text-transform: capitalize;
  display: flex;
  align-items: center;
  gap: 6px;
  &:hover {
    background: white;
    color: var(--text-color);
  }
  &[disabled] {
    cursor: not-allowed;
  }
`

const BalanceContainer = styled.div`
  display: flex;
  align-items: stretch;
  border-top: 1px solid var(--color);
`

const WithdrawContainer = styled.div`
  --color: #1559ed;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 23px;
  .input-box {
    border: 1px solid var(--color);
    border-radius: 3px;
    margin-top: 20px;

    >input {
      flex: 1;
      font-size: 13px;
      padding: 8px 10px;
      color: white;
    }

    .button-max {
      width: 100px;
      align-self: stretch;
      text-transform: uppercase;
      border-left: 1px solid var(--color);
      font-size: 10px;
      &:hover {
        color: white;
      }
      &[disabled] {
        cursor: not-allowed;
      }
    }
  }

  .submit-button {
    background: var(--color);
    line-height: 1.2;
    font-size: 16px;
    padding: 10px 30px;
    color: white;
    border-radius: 6px;
    clip-path: polygon(20px 0,100% 0,100% 50%,calc(100% - 20px) 100%,0 100%,0 50%);
    transition: all .3s;
    margin-top: 20px;
    text-transform: capitalize;
    display: flex;
    align-items: center;
    gap: 6px;
    &:hover {
      background: white;
      color: var(--text-color);
    }
    &[disabled] {
      cursor: not-allowed;
    }
  }
`
