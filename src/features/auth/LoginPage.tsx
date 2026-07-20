import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate } from 'react-router-dom';
import { z } from 'zod/v4';
import { useAuth } from '@/auth/UserContext';
import { LanguageToggle } from '@/components/LanguageToggle';
import {
  accent,
  brandSecondary,
  cardRadius,
  getEnvironmentLabel,
  lightDesignTokens,
  sidebarActiveBg,
  sidebarBg,
  sidebarBorder,
  sidebarText,
  sidebarTextMuted,
} from '@/theme/theme';
import { LightThemeScope } from '@/theme/LightThemeScope';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'auth.validation.emailRequired')
    .pipe(z.email('auth.validation.emailInvalid')),
  password: z.string().min(1, 'auth.validation.passwordRequired'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const { login, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/prime" replace />;
  }

  return (
    <LightThemeScope>
      <LoginPageContent onLogin={login} />
    </LightThemeScope>
  );
}

function LoginPageContent({ onLogin }: { onLogin: (email: string, password: string) => void }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const tokens = lightDesignTokens;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (values: LoginFormValues) => {
    onLogin(values.email, values.password);
    navigate('/prime');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: tokens.pageBackground, position: 'relative' }}>
      <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 2 }}>
        <LanguageToggle />
      </Box>

      <Box
        sx={{
          display: 'flex',
          minHeight: '100vh',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        <Box
          sx={{
            flex: { xs: '0 0 auto', md: '1 1 50%' },
            minHeight: { xs: 200, md: 'auto' },
            background: `linear-gradient(160deg, ${sidebarBg} 0%, ${sidebarActiveBg} 55%, #0F3533 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 4,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              opacity: 0.15,
              backgroundImage: `radial-gradient(circle at 20% 80%, ${accent} 0%, transparent 50%), radial-gradient(circle at 80% 20%, ${accent} 0%, transparent 40%)`,
            }}
          />
          <Box sx={{ position: 'relative', textAlign: 'center' }}>
            <Box
              component="img"
              src="/leddi-logo.png"
              alt="Leddi"
              sx={{
                height: 48,
                width: 'auto',
                objectFit: 'contain',
                display: 'block',
                mx: 'auto',
                mb: 2,
              }}
            />
            <Typography
              variant="h5"
              sx={{
                color: '#FFFFFF',
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontSize: '1.125rem',
              }}
            >
              {t('app.title')}
            </Typography>
            <Typography sx={{ color: sidebarTextMuted, mt: 1.5, fontSize: '0.875rem' }}>
              {t('auth.tagline')}
            </Typography>
            <Box
              sx={{
                mt: 3,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.75,
                px: 1.5,
                py: 0.5,
                borderRadius: '20px',
                bgcolor: 'rgba(0, 0, 0, 0.25)',
                border: `1px solid ${sidebarBorder}`,
              }}
            >
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#4ADE80' }} />
              <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600, color: sidebarText }}>
                {t('app.environmentPill', { env: getEnvironmentLabel() })}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            flex: { xs: '1 1 auto', md: '1 1 50%' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: { xs: 3, md: 6 },
          }}
        >
          <Paper
            elevation={0}
            sx={{
              width: '100%',
              maxWidth: 400,
              p: { xs: 3, sm: 4 },
              borderRadius: `${cardRadius}px`,
              boxShadow: tokens.cardShadow,
              border: `1px solid ${tokens.borderSubtle}`,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 3 }}>
              <Box
                component="img"
                src="/leddi-logo.png"
                alt="Leddi"
                sx={{ height: 28, width: 'auto', objectFit: 'contain' }}
              />
              <Typography variant="h6" sx={{ color: tokens.textPrimary, fontWeight: 700 }}>
                {t('app.title')}
              </Typography>
            </Box>

            <Typography variant="h6" sx={{ mb: 0.5, fontWeight: 700 }}>
              {t('auth.loginTitle')}
            </Typography>
            <Typography variant="body2" sx={{ color: tokens.textSecondary, mb: 3 }}>
              {t('auth.loginSubtitle')}
            </Typography>

            <Box
              component="form"
              onSubmit={(e) => {
                void handleSubmit(onSubmit)(e);
              }}
              noValidate
            >
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t('auth.email')}
                    type="email"
                    autoComplete="email"
                    margin="normal"
                    error={Boolean(errors.email)}
                    helperText={errors.email?.message ? t(errors.email.message) : undefined}
                  />
                )}
              />
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t('auth.password')}
                    type="password"
                    autoComplete="current-password"
                    margin="normal"
                    error={Boolean(errors.password)}
                    helperText={errors.password?.message ? t(errors.password.message) : undefined}
                  />
                )}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="medium"
                sx={{ mt: 3, py: 1.25, bgcolor: brandSecondary, '&:hover': { bgcolor: brandSecondary } }}
              >
                {t('auth.login')}
              </Button>
            </Box>

            <Typography
              variant="caption"
              sx={{ display: 'block', mt: 2, color: tokens.textSecondary, textAlign: 'center' }}
            >
              {t('auth.mockNotice')}
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
