import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip,
} from '@mui/material';
import Layout from '../components/Layout';
import { auditAPI } from '../services/api';
import { formatDateTime } from '../utils/helpers';

const AdminAudit = ({ toggleTheme, darkMode }) => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    auditAPI.getAll().then((r) => setLogs(r.data)).catch(() => {});
  }, []);

  return (
    <Layout title="Platform Audit Logs" toggleTheme={toggleTheme} darkMode={darkMode}>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Entity</TableCell>
              <TableCell>Details</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log._id}>
                <TableCell>{log.userId?.name || 'System'}</TableCell>
                <TableCell><Chip label={log.action} size="small" /></TableCell>
                <TableCell>{log.entity}</TableCell>
                <TableCell>{log.details}</TableCell>
                <TableCell>{formatDateTime(log.createdAt)}</TableCell>
              </TableRow>
            ))}
            {!logs.length && (
              <TableRow><TableCell colSpan={5} align="center">No audit logs yet</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Layout>
  );
};

export default AdminAudit;
