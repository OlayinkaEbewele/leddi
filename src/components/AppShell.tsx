import Box from '@mui/material/Box';
import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { pageBackground } from '@/theme/theme';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar
        collapsed={collapsed}
        onToggleCollapsed={() => {
          setCollapsed((c) => !c);
        }}
      />
      <Box
        component="main"
        sx={{
          flex: 1,
          minWidth: 0,
          minHeight: 0,
          overflow: 'auto',
          bgcolor: pageBackground,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
