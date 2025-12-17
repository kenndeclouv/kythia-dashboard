'use client';

import { useState, useEffect, useCallback } from 'react';

import Link from 'next/link'; // Pakai ini buat navigasi
import { useParams } from 'next/navigation';

// MUI Imports
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

// Third-party Imports
import { toast } from 'react-toastify';

type License = {
	id: string;
	key: string;
	ownerId: string;
	isActive: boolean;
	lastUsed: string;
	createdAt: string;
};

const LicenseListPage = () => {
	const [licenses, setLicenses] = useState<License[]>([]);
	const [loading, setLoading] = useState(true);
	const [open, setOpen] = useState(false);
	const [ownerId, setOwnerId] = useState('');
	const [generating, setGenerating] = useState(false);

	// Ambil lang dari params kalau butuh construct URL manual, tapi Link otomatis handle biasanya
	const params = useParams();
	const lang = params.lang || 'en';

	const fetchLicenses = useCallback(async () => {
		try {
			const res = await fetch('/api/v1/license/list');
			const data = await res.json();

			if (Array.isArray(data)) setLicenses(data);
		} catch (error) {
			console.error(error);
			toast.error('Failed to fetch licenses');
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchLicenses();
	}, [fetchLicenses]);

	const handleGenerate = async () => {
		if (!ownerId) return toast.error('Owner ID is required');
		setGenerating(true);

		try {
			const res = await fetch('/api/v1/license/generate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ ownerId }),
			});

			const data = await res.json();

			if (res.ok) {
				toast.success('License generated!');
				setOpen(false);
				setOwnerId('');
				fetchLicenses();
			} else {
				toast.error(data.error || 'Failed');
			}
		} catch (_e) {
			toast.error('Error generating license');
		} finally {
			setGenerating(false);
		}
	};

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text);
		toast.success('Copied!');
	};

	return (
		<>
			<Card>
				<CardHeader
					title="License Manager"
					action={
						<Button
							variant="contained"
							onClick={() => setOpen(true)}
							startIcon={<i className="tabler-plus" />}
						>
							New License
						</Button>
					}
				/>
				<div className="overflow-x-auto">
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Key</TableCell>
								<TableCell>Owner ID</TableCell>
								<TableCell>Status</TableCell>
								<TableCell>Last Used</TableCell>
								<TableCell>Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{loading ? (
								<TableRow>
									<TableCell colSpan={5} align="center">
										Loading...
									</TableCell>
								</TableRow>
							) : licenses.length === 0 ? (
								<TableRow>
									<TableCell colSpan={5} align="center">
										No licenses found
									</TableCell>
								</TableRow>
							) : (
								licenses.map((license) => (
									<TableRow key={license.id}>
										<TableCell>
											<div className="flex items-center gap-2">
												<Typography
													variant="body2"
													className="font-mono font-medium"
												>
													{license.key}
												</Typography>
												<Tooltip title="Copy">
													<IconButton
														size="small"
														onClick={() => copyToClipboard(license.key)}
													>
														<i className="tabler-copy text-xs" />
													</IconButton>
												</Tooltip>
											</div>
										</TableCell>
										<TableCell>{license.ownerId}</TableCell>
										<TableCell>
											<Chip
												label={license.isActive ? 'Active' : 'Suspended'}
												color={license.isActive ? 'success' : 'error'}
												size="small"
												variant="tonal"
											/>
										</TableCell>
										<TableCell>
											{new Date(license.lastUsed).toLocaleString()}
										</TableCell>
										<TableCell>
											{/* INI NAVIGASI KE PAGE BARU */}
											<Link href={`/${lang}/dash/admin/license/${license.id}`}>
												<IconButton size="small" color="primary">
													<i className="tabler-eye" />
												</IconButton>
											</Link>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>
			</Card>

			{/* Generate Dialog tetep disini */}
			<Dialog
				open={open}
				maxWidth="md"
				fullWidth
				onClose={() => setOpen(false)}
			>
				<DialogTitle>Generate New License</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						margin="dense"
						label="Owner ID (Discord User ID)"
						fullWidth
						variant="outlined"
						value={ownerId}
						onChange={(e) => setOwnerId(e.target.value)}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpen(false)}>Cancel</Button>
					<Button
						onClick={handleGenerate}
						variant="contained"
						disabled={generating}
					>
						{generating ? 'Generating...' : 'Generate'}
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default LicenseListPage;
