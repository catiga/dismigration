import { Image } from '../../component'
import styled from 'styled-components'
import Button from '../../component/Button'
export default function Migration() {
  return (
    <MigrationContanier>
      <div className='title'>Migration</div> 
      <div className='info'>
        <div>Why migration ETHF and DIS?</div>
        <div>Both ETHF and DIS will release currency exchange contracts. The currency exchange contract is a token distribution on the new main network. The address holding ETHF needs to pledge the tokens to the currency exchange contract of ETHF. The address holding Dis needs to transfer the tokens. The currency is pledged to the currency exchange contract of Dis.</div>
      </div>
      <div className='d-flex'>
        <div className='migration-data'>
          <div className='name'>Token migration value</div>
          <div className='value'>XXXX</div>
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
              <Image size={48} src="https://www.gate.io/images/coin_icon/64/ethf.png" />
            </div>
          </div>
          <div className='item'>
            <div className='name'>Rewards</div>
            <div className='value'>27,397</div>
          </div>
          <div className='item'>
            <div className='name'>Wallet Balance</div>
            <div className='value'>XXXETHF</div>
          </div>
        </div>
        <div className='migration-item-wrap d-flex'>
          <div className='item'>
            <div className='name'>DIS</div>
            <div className='value'>
              <Image size={48} src="https://www.gate.io/images/coin_icon/64/ethf.png" />
            </div>
          </div>
          <div className='item'>
            <div className='name'>Rewards</div>
            <div className='value'>27,397</div>
          </div>
          <div className='item'>
            <div className='name'>Wallet Balance</div>
            <div className='value'>XXXDIS</div>
          </div>
        </div>
        <div className='migration-item-wrap d-flex migration-item-wrap-last'>
          <div className='item'>
            <div className='name'>Migration ETHF</div>
            <div className='value'>
              <span className='color-blue'>0</span>
              <span>$0</span>
            </div>
          </div>
          
          <div className='item'>
            <Button label="Start Now" size="small" style="primary" />
          </div>
        </div>
        <div className='migration-item-wrap d-flex migration-item-wrap-last'>
          <div className='item'>
            <div className='name'>Migration  DIS</div>
            <div className='value'>
              <span className='color-blue'>0</span>
              <span>$0</span>
            </div>
          </div>
          
          <div className='item'>
            <Button label="Start Now" size="small" style="primary" />
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
            <div className='name'>Cutoff block height</div>
            <div className='value'>
              <span>18219623</span>
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
    padding: 6px 48px 20px;
    background-color: #ffffff;
    border-radius: 30px;
    border: solid 1px #d5d8dc;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    &-last {
      padding: 0 48px;
    }
    &-full {
      width: 100%
    }
    .color-blue {
      font-size: 32px;
      margin-right: 20px;
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