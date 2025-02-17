import React from 'react'
import { Helmet } from 'react-helmet'
import { Grid } from 'semantic-ui-react'
import { Logo, Header, Popup } from 'decentraland-ui'
import {
  FormattedMessage,
  FormattedPlural,
  FormattedNumber,
  useIntl,
} from 'react-intl'
import { copyToClipboard, getMonthDiff } from '../../../utils'
import ManaWidget from '../../ManaWidget'
import useResponsive from '../../../hooks/useResponsive'
import Responsive from 'semantic-ui-react/dist/commonjs/addons/Responsive'
import Copy from '../../../images/copy.svg'
import Link from '../../../images/link.svg'
import DaiLogo from '../../../images/dai_logo.svg'
import UsdtLogo from '../../../images/usdt_logo.svg'
import UsdcLogo from '../../../images/usdc_logo.svg'

import './Overview.css'
import useReviewUrl from '../../../hooks/useReviewUrl'

const logo = {
  DAI: DaiLogo,
  USDT: UsdtLogo,
  USDC: UsdcLogo,
}

export default function Overview(props) {
  const { address, contract } = props

  const { symbol, start, cliff, duration, total } = contract
  const vestingMonths = getMonthDiff(start, start + duration)
  const vestingCliff = getMonthDiff(start, cliff)

  const [reviewUrl, handleClick] = useReviewUrl(address)

  const responsive = useResponsive()
  const isMobile = responsive({ maxWidth: Responsive.onlyMobile.maxWidth })

  const intl = useIntl()

  return (
    <>
      <Helmet>
        <title>
          {intl.formatMessage({ id: 'global.title' }, { token: symbol })}
        </title>
      </Helmet>
      <Grid
        columns={symbol === 'MANA' && !isMobile ? 2 : 1}
        className="overview"
      >
        <Grid.Row>
          <Grid.Column floated="left" style={{ padding: 0 }}>
            <Grid className="contract" style={{ width: '100%' }}>
              {symbol !== 'MANA' ? (
                <Grid.Column className="TokenLogo">
                  <img
                    src={logo[symbol]}
                    style={{ width: isMobile ? '48px' : '72px' }}
                    alt=""
                  />
                </Grid.Column>
              ) : (
                isMobile && (
                  <Grid.Column className="TokenLogo">
                    <Logo />
                  </Grid.Column>
                )
              )}
              <Grid.Column className="Info">
                <Header size="large" className={`TokenContract ${symbol}`}>
                  <FormattedMessage
                    id="overview.title"
                    values={{ token: symbol }}
                  />
                </Header>
                <Header sub>
                  {address}{' '}
                  <a href={reviewUrl} onClick={handleClick}>
                    <img src={Link} alt="" />
                  </a>
                  <Popup
                    content={<FormattedMessage id="global.copied" />}
                    position="bottom center"
                    trigger={
                      <img
                        src={Copy}
                        alt=""
                        onClick={() => copyToClipboard(address)}
                      />
                    }
                    on="click"
                  />
                </Header>
              </Grid.Column>
            </Grid>
            <Header
              style={
                (symbol === 'MANA' && !isMobile && { maxWidth: '500px' }) || {}
              }
            >
              <FormattedMessage
                id="overview.details"
                values={{
                  amount: <FormattedNumber value={Math.round(total)} />,
                  token: symbol,
                  months: vestingMonths,
                  monthsPl: (
                    <FormattedPlural
                      value={vestingMonths}
                      one={<FormattedMessage id="global.month" />}
                      other={<FormattedMessage id="global.month.plural" />}
                    />
                  ),
                  cliff: vestingCliff,
                  monthsCliffPl: (
                    <FormattedPlural
                      value={vestingCliff}
                      one={<FormattedMessage id="global.month" />}
                      other={<FormattedMessage id="global.month.plural" />}
                    />
                  ),
                }}
              />
            </Header>
          </Grid.Column>
          {symbol === 'MANA' && !isMobile && (
            <Grid.Column floated="right">
              <ManaWidget />
            </Grid.Column>
          )}
        </Grid.Row>
      </Grid>
    </>
  )
}
