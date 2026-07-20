import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import type { SelectChangeEvent } from '@mui/material/Select';
import { useTranslation } from 'react-i18next';
import type { Role } from '@/auth/roles';
import { useUserContext } from '@/auth/UserContext';
import { isProduction } from '@/theme/theme';

const ALL_ROLES: Role[] = [
  'DEAL_ADMIN',
  'COLLECTIONS_ADMIN_AFS',
  'COLLECTIONS_OFFICER_AFS',
  'AFS_HEAD',
  'PAYMENT_ADMIN',
  'I_SYSTEMS_ADMIN',
];

export function DevRoleSwitcher() {
  const { t } = useTranslation();
  const { user, setRoles } = useUserContext();

  if (isProduction || !user) return null;

  const handleChange = (event: SelectChangeEvent) => {
    setRoles([event.target.value as Role]);
  };

  const currentValue = user.roles[0] ?? 'COLLECTIONS_OFFICER_AFS';

  return (
    <FormControl size="small" sx={{ minWidth: 180 }}>
      <InputLabel id="dev-role-switcher-label">{t('roleSwitcher.label')}</InputLabel>
      <Select
        labelId="dev-role-switcher-label"
        value={currentValue}
        label={t('roleSwitcher.label')}
        onChange={handleChange}
      >
        {ALL_ROLES.map((role) => (
          <MenuItem key={role} value={role}>
            {role.replace(/_/g, ' ')}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
