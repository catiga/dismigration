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
const disAddress = '0x26bdaC451fE5A111a9D8a066c23BD0F099b9E563'
const startTs = 1697040000
const providerObject = new Web3.providers.HttpProvider(ethfRpcProvider);
const web3Ethf = new Web3(providerObject);

const disLocker = new web3Ethf.eth.Contract(TOKEN_ABI, disAddress)

export default function Migration() {
  const { accounts, currentTokenBalance } = useGlobal()

  const [currentBlock, setCurrentBlock] = useState(BigNumber.from(0))

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
  const [rewardDynamic, setRewardDynamic] = useState(BigNumber.from(0))
  const [totalPool, setTotalPool] = useState(BigNumber.from(0))

  const [pledgeEthf, setPledgeEthf] = useState('')
  const [pledgeDis, setPledgeDis] = useState('')
  const [withdrawDis, setWithdrawDis] = useState('')
  const [toastMessage, setToastMessage] = useState('')
  const [showToast, setShowToast] = useState(false);
  const [blockNumber, setBlockNumber] = useState('');
  const [pledgeLoading, setPledgeLoading] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [showModal, setShowModal] = useState(false)
  const [showOffReward, setShowOffReward] = useState(false)

  const whiteAddress = ['0xcdadF654c54bD0569bf525bf3b2A03737E9a1FD6', '0xDC6F036a6FE27c8e70F4cf3b2f87Bd97a6b29a2f']

  const numberWithCommas = (x) => {
    const parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }

  const handleLastBlock = () => {
    web3Ethf.eth.getBlock('latest').then(lastBlock => {
      setCurrentBlock(lastBlock.number)
    })
  }

  const handleBalance = async (account) => {
    const balanceEthfWei = await web3Ethf.eth.getBalance(account)
    setDisBalance(balanceEthfWei)
  }

  const handleTotalReward = () => {
    // const chainLocker = selectChain(513100)
    // const ethfLocker = new web3Ethf.eth.Contract(chainLocker.abi, chainLocker.address)

    web3Ethf.eth.getBalance(disAddress).then(contractBalance => {
      setTotalPool(contractBalance)
    })
  }

  const handleDeposit = (account) => {
    // const ethfLocker = new web3Ethf.eth.Contract(TOKEN_ABI, disAddress)
    disLocker.methods.deposits(account).call().then(depositEthfWei => {
      setDisDeposit(depositEthfWei)
    })
  }

  const handleEthfReward = (account) => {
    // const web3Ethf = new Web3(new Web3.providers.HttpProvider(ethfRpcProvider));
    // const chainLocker = selectChain(513100)
    // const ethfLocker = new web3Ethf.eth.Contract(chainLocker.abi, chainLocker.address)

    disLocker.methods.earned(account).call().then(rewardEthfWei => {
      setEthfReward(rewardEthfWei)
    })

    disLocker.methods.lastStakeTime(accounts[0]).call().then(ts => {
      const timerange = Math.floor(new Date().getTime() / 1000) - Number(ts)
      setLastApplyTs(timerange)
    })
  }

  const handleDisReward = (account) => {
    // const disLocker = new web3Ethf.eth.Contract(TOKEN_ABI, disAddress)
    disLocker.methods.earned(account).call().then(rewardDisWei => {
      setDisReward(rewardDisWei)
    })
  }

  const handleTotalSupply = () => {
    // const ethfLocker = new web3Ethf.eth.Contract(TOKEN_ABI, disAddress)
    disLocker.methods.totalSupply().call().then(ethfTotalSupply=>{
      setEthfTotal(ethfTotalSupply)
    })

    disLocker.methods.totalSupply().call().then(disTotalSupply => {
      setDisTotal(disTotalSupply)
    })
  }

  const getTotalRewards = () => {
    disLocker.methods.rewardPerTokenStored().call().then(rewardTotal => {
      setRewardTotal(rewardTotal)
    })

    disLocker.methods.rewardPerSec().call().then(rewardPerSec => {
      setRewardDynamic(rewardPerSec)
    })
  }

  const getBlockNumber = () => {
    disLocker.methods.onStartTs().call().then(blockNumber => {
      setBlockNumber((new Date(1705465800 * 1000)).toLocaleString())
    }).catch(e => {
      console.log('err=>>', e)
    })    
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
    // setPledgeEthf(loadBal)
    setPledgeEthf(truncateBigNumber(loadBal, 4))
  }

  const handleInputPledgeDis = async () => {
    // if (BigNumber.from(disBalance) == BigNumber.from(0)) {
    //   return
    // }
    const gasPrice = '15000000000000000'
    if(BigNumber.from(disBalance).lte(BigNumber.from(gasPrice))) {
      handleToast('Not Enough $DIS to pledge')
      return
    }
    const loadBal = ((BigNumber.from(disBalance) - BigNumber.from(gasPrice)) / BigNumber.from(dec))//.toFixed(4)

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
                chainName: 'DIS Chain',
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
      // const chainLocker = selectChain(513100)
      const pledgeEthfWei = web3.utils.toWei(pledgeEthf, "ether")
      // const ethfLocker = new web3.eth.Contract(chainLocker.abi, chainLocker.address)
      const calldata = disLocker.methods.stakeAndReward(pledgeEthfWei).encodeABI()

      try {
        const transaction = await disLocker.methods.stakeAndReward(pledgeEthfWei).send({
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
    let web3;
    if(window.ethereum) {
      console.log('window.ethereum found, prepare to init...')
      web3 = new Web3(window.ethereum);
      console.log('window.ethereum found, initialized...')
    } else if (window.web3) {
      // 如果旧版 web3 已经注入，使用注入的提供者
      web3 = new Web3(window.web3.currentProvider);
      // 成功后的代码...
    }
    if(!web3) {
      console.log('init web3 failed');
      handleToast('Web3 Provider Not Correct!');
      setPledgeLoading(false);
      return
    }
    // await window.ethereum.request({ method: 'eth_requestAccounts' });
    console.log('start get network id')
    // const currentNetwork = await web3.eth.net.getId()
    const currentNetwork = await web3.eth.getChainId();
    console.log('currentNetwork:', currentNetwork)
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
              blockExplorerUrls: ['https://scan.dischain.xyz'],  // 替换为您的链的区块浏览器 URL
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
      console.log('start build contract object')
      const pledgeDisWei = web3.utils.toWei(pledgeDis, "ether")
      const disLocker_1 = new web3.eth.Contract(TOKEN_ABI, disAddress)
      const calldata = disLocker_1.methods.stakeAndReward(pledgeDisWei).encodeABI()
      
      try {

        const transaction = await disLocker_1.methods.stakeAndReward(pledgeDisWei).send({
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
      const deposits = await contract.methods.deposits(accounts[0]).call();
      const balance = await contract.methods.balanceOf(accounts[0]).call();
      console.log('current available:', accounts[0], withdrawDisWei, deposits, balance);
      
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

  const handleOffwards = async () => {
    const web3 = new Web3(window.ethereum)
    const contract = new web3.eth.Contract(TOKEN_ABI, disAddress)
    const calldata = contract.methods.offerReward().encodeABI()

    try {

      const trObj = {
        from: accounts[0],
        gas: 300000,
        data: calldata,
      }

      let gase = await contract.methods.offerReward().estimateGas(trObj)

      const r = await contract.methods.offerReward().send({
        from: accounts[0],
        gas: 300000,
        data: calldata,
        // value: Web3.utils.toWei('821917.81', 'ether')
        value: Web3.utils.toWei('0.1', 'ether')
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
    handleTotalSupply()
    getTotalRewards()
    getBlockNumber()
    handleTotalReward()
    if (accounts && accounts[0]) {
      handleBalance(accounts[0])
      // 判断是否是白单地址，露出按钮
      let userAddress = Web3.utils.toChecksumAddress(accounts[0])
      let isTrue = whiteAddress.map(v => {
        return Web3.utils.toChecksumAddress(v)
      }).some(v => v == userAddress)
      if (isTrue) {
        setShowOffReward(true)
      } else {
        setShowOffReward(false)
      }

      const interval = setInterval(() => {
        handleDeposit(accounts[0])
        handleEthfReward(accounts[0])
        handleDisReward(accounts[0])
        handleLastBlock()
      }, 9000)

      return () => {
        clearInterval(interval)
      }
    }
    
  }, [accounts, ethfDeposit, ethfReward, lastApplyTs, disReward, currentBlock])

  return (
    <MigrationContanier>

      <div className='w-[90%] lg:w-[1000px] leading-[1.2]'>
        <h1 className='text-2xl font-cs'>$DIS Staking Mining</h1>
        <p className='text-sm my-2'>Why to Join Mine by Staking?</p>
        <p className='text-sm'>Discover the rewarding world of $DIS, the native coin of Disney Chain, a POW public blockchain where miners can engage in mining operations to earn $DIS tokens. Not just for miners, $DIS holders can also participate in the network by staking their coins, joining the mining process, and reaping rewards. With a steady generation of 0.3171 $DIS per second, entering the Disney Chain ecosystem is not only a venture into a robust POW platform but also an opportunity to share in the ongoing distribution of rewards. Secure your spot in this lucrative mining landscape by acquiring $DIS and staking to earn your share of the digital bounty. Join us and become a part of the Disney Chain community, where your contribution is valued and rewarded every second!</p>
      </div>

      <div className='text-gray-300 w-[90%] lg:w-[1000px] mx-auto font-cm text-base flex flex-col lg:flex-row items-center'>
        <h1 className='ml-auto lg:ml-0'>Wallet Balance: { accounts ? <span>{ (BigNumber.from(disBalance) / BigNumber.from(dec)).toFixed(4) } DIS</span> : <span>--.--</span> }</h1>
        <h1 style={{'marginLeft': 'auto'}}>Start Time: <span className='ml-2'>{blockNumber || ' loading...'}</span></h1>
      </div>
      <div className='w-[90%] lg:w-[1000px]'>
        {
          showOffReward
          ? <DefaultButton className='inline-block' onClick={() => handleOffwards()}>Off Reward</DefaultButton>
          : <></>
        }
      </div>
      
      <InnerContainer className='font-cm lg:w-[1000px]'>

        <InnerTop>
          <TitleText>$DIS total stake</TitleText>
          <HolderScore>{numberWithCommas((BigNumber.from(disTotal) / BigNumber.from(dec)).toFixed(4))}</HolderScore>
        </InnerTop>

        <InnerBottom className='flex-col lg:flex-row'>

          <InnerBottomItem>
            <TitleText>Total Reward Pool</TitleText>
            <SecondScore>821,917.81</SecondScore>
            {/* <DescriptionText>DIS/ETHF (day)*</DescriptionText> */}
          </InnerBottomItem>
          <InnerBottomItem>
            <TitleText>Reward token stored</TitleText>
            <SecondScore>{(BigNumber.from(rewardDynamic) / BigNumber.from(dec)).toFixed(4)}</SecondScore>
            {/* <DescriptionText>DIS/ETHF (day)*</DescriptionText> */}
          </InnerBottomItem>

          <InnerBottomItem className='border-t border-b lg:border-l lg:border-r border-[#1559ed]'>
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
              ? <SecondScore>{(BigNumber.from(disReward) / BigNumber.from(dec)).toFixed(6)}</SecondScore>
              : <SecondScore>--.--</SecondScore>
            }
            <DefaultButton onClick={() => handleWithdrawRewards()}>Get Reward</DefaultButton>
          </InnerBottomItem>

        </InnerBottom>

        <BalanceContainer className='flex-col lg:flex-row'>
          <WithdrawContainer>
            <TitleText>Deposit</TitleText>
            <div className='flex flex-col lg:flex-row items-center gap-4'>
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
          <WithdrawContainer className='border-t lg:border-l border-[#1559ed]'>
            <TitleText>Withdraw</TitleText>
            <div className='flex flex-col lg:flex-row items-center gap-4'>
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
