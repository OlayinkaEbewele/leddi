import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { isCountryFilterAdmin } from '@/auth/roles';
import { useCurrentUser } from '@/auth/UserContext';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import { LanguageToggle } from '@/components/LanguageToggle';
import { pagePadding } from '@/theme/theme';
import { formatLongDashboardDate } from '@/utils/formatDate';
import { PortfolioSummaryCards } from './components/PortfolioSummaryCards';
import { PriorityWorklist } from './components/PriorityWorklist';
import { RiskBucketCards } from './components/RiskBucketCards';
import type { DashboardLayoutMode } from './dashboardTheme';
import { useDashboardQuery } from './hooks/useDashboardQuery';
import { getCountryFlag, getGreetingPeriod } from './utils/dashboardUtils';

export function DashboardPage() {
  const { t } = useTranslation();
  const user = useCurrentUser();
  const greetingPeriod = getGreetingPeriod();
  const [layoutMode, setLayoutMode] = useState<DashboardLayoutMode>('filled');

  const dashboardQuery = useMemo(
    () => ({
      country: isCountryFilterAdmin(user.roles) ? undefined : user.country,
    }),
    [user.roles, user.country],
  );

  const { data, isLoading } = useDashboardQuery(dashboardQuery);

  const firstName = user.name.split(' ')[0] ?? user.name;
  const flag = getCountryFlag(user.country);

  const portfolioLabel = isCountryFilterAdmin(user.roles)
    ? t('dashboard.header.allCountries')
    : t('dashboard.header.countryPortfolio', { country: user.country });

  const portfolioSubtitle = isCountryFilterAdmin(user.roles)
    ? t('dashboard.summary.acrossAllCountries')
    : t('dashboard.summary.acrossPortfolio', { country: user.country });

  return (
    <Box sx={{ p: pagePadding }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.75, fontSize: { xs: '1.5rem', md: '1.75rem' } }}>
            {t(`dashboard.greeting.${greetingPeriod}`, { name: firstName })}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            {formatLongDashboardDate()}
            <Box component="span" sx={{ opacity: 0.5 }}>
              ·
            </Box>
            {flag && (
              <Box component="span" aria-hidden>
                {flag}
              </Box>
            )}
            {portfolioLabel}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DarkModeToggle />
          <LanguageToggle />
        </Box>
      </Box>

      <PortfolioSummaryCards
        summary={data}
        loading={isLoading}
        portfolioSubtitle={portfolioSubtitle}
      />

      <Box sx={{ mt: 4 }}>
        <RiskBucketCards
          summary={data}
          loading={isLoading}
          layoutMode={layoutMode}
          onLayoutModeChange={setLayoutMode}
        />
      </Box>

      <Box sx={{ mt: 4 }}>
        <PriorityWorklist
          items={data?.topPriorityLoans}
          totalLoanCount={data?.totalLoanCount ?? 0}
          loading={isLoading}
          layoutMode={layoutMode}
        />
      </Box>
    </Box>
  );
}
