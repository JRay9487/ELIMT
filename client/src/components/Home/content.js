import * as React from 'react';
import Paper from '@mui/material/Paper';

//不同分頁
import Profile from './content/profile';
import Labbook from './content/LB';
import LBapprove from './content/LBapprove';
import Links from './content/links';
import Users from './content/users';
import Google_drive from './content/gdrive';

const CONTENT_MAP = {
  'Profile' : Profile,
  'Lab Book' : Labbook,
  'Lab Book Approval': LBapprove,
  'Links': Links,
  'Google Drive': Google_drive,
  'Users': Users,
};

export default function Content(props) {
  const { activeItem, } = props;

  const renderContent = CONTENT_MAP[activeItem] || Profile ;

  return (
    <Paper sx={{ maxWidth: 936, margin: 'auto', overflow: 'hidden' }}>
      {renderContent()}
    </Paper>
  );
}
