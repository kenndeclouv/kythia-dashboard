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
import DialogContentText from '@mui/material/DialogContentText';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import InputAdornment from '@mui/material/InputAdornment';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';

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
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [selectedLicenseId, setSelectedLicenseId] = useState<string | null>(
		null,
	);
	const [actionLoading, setActionLoading] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

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

	const handleToggleStatus = async (id: string, currentStatus: boolean) => {
		try {
			const res = await fetch(`/api/v1/license/${id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ isActive: !currentStatus }),
			});

			if (res.ok) {
				toast.success(`License ${!currentStatus ? 'activated' : 'suspended'}`);
				fetchLicenses();
			} else {
				const data = await res.json();
				toast.error(data.error || 'Failed to update status');
			}
		} catch (error) {
			console.error(error);
			toast.error('Error updating license status');
		}
	};

	const handleDelete = (id: string) => {
		setSelectedLicenseId(id);
		setDeleteDialogOpen(true);
	};

	const handleDeleteCancel = () => {
		if (!actionLoading) {
			setDeleteDialogOpen(false);
			setSelectedLicenseId(null);
		}
	};

	const confirmDelete = async () => {
		if (!selectedLicenseId) return;
		setActionLoading(true);

		try {
			const res = await fetch(`/api/v1/license/${selectedLicenseId}`, {
				method: 'DELETE',
			});

			if (res.ok) {
				toast.success('License deleted');
				fetchLicenses();
				setDeleteDialogOpen(false);
				setSelectedLicenseId(null);
			} else {
				const data = await res.json();
				toast.error(data.error || 'Failed to delete license');
			}
		} catch (error) {
			console.error(error);
			toast.error('Error deleting license');
		} finally {
			setActionLoading(false);
		}
	};

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text);
		toast.success('Copied!');
	};

	// Filter and paginate licenses
	const filteredLicenses = licenses.filter((license) => {
		if (!searchQuery) return true;
		const query = searchQuery.toLowerCase();
		return (
			license.key.toLowerCase().includes(query) ||
			license.ownerId.toLowerCase().includes(query) ||
			(license.isActive ? 'active' : 'suspended').includes(query)
		);
	});

	const paginatedLicenses = filteredLicenses.slice(
		page * rowsPerPage,
		page * rowsPerPage + rowsPerPage,
	);

	const handleChangePage = (_event: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	return (
		<>
			<Card>
				<CardHeader
					title="License Manager"
					subheader={`${filteredLicenses.length} of ${licenses.length} licenses`}
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
				<Divider />
				<CardContent className="pb-0">
					<TextField
						fullWidth
						size="small"
						placeholder="Search by license key, owner ID or status..."
						value={searchQuery}
						onChange={(e) => {
							setSearchQuery(e.target.value);
							setPage(0);
						}}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<i className="tabler-search" />
								</InputAdornment>
							),
						}}
						className="mb-4"
					/>
				</CardContent>
				<TableContainer>
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
							) : paginatedLicenses.length === 0 ? (
								<TableRow>
									<TableCell colSpan={5} align="center" className="py-8">
										<div className="flex flex-col items-center gap-2">
											<i className="tabler-search-off text-4xl opacity-50" />
											<Typography variant="body2" color="textSecondary">
												No licenses match your search
											</Typography>
										</div>
									</TableCell>
								</TableRow>
							) : (
								paginatedLicenses.map((license) => (
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
											<div className="flex items-center gap-2">
												<Link
													href={`/${lang}/dash/admin/license/${license.id}`}
												>
													<Button
														variant="tonal"
														size="small"
														startIcon={<i className="tabler-eye" />}
													>
														View
													</Button>
												</Link>
												<Button
													variant="tonal"
													size="small"
													color={license.isActive ? 'warning' : 'success'}
													onClick={() =>
														handleToggleStatus(license.id, license.isActive)
													}
													startIcon={
														<i
															className={
																license.isActive
																	? 'tabler-player-pause'
																	: 'tabler-player-play'
															}
														/>
													}
												>
													{license.isActive ? 'Suspend' : 'Activate'}
												</Button>
												<Button
													variant="tonal"
													size="small"
													color="error"
													onClick={() => handleDelete(license.id)}
													startIcon={<i className="tabler-trash" />}
												>
													Delete
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</TableContainer>
				<Divider />
				<TablePagination
					rowsPerPageOptions={[5, 10, 25, 50]}
					component="div"
					count={filteredLicenses.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
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
			<Dialog
				open={deleteDialogOpen}
				onClose={handleDeleteCancel}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle
					id="alert-dialog-title"
					className="text-error flex items-center gap-2"
				>
					<i className="tabler-alert-triangle text-xl" />
					Confirm Deletion
				</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						Are you sure you want to permanently delete this license?
						<br />
						<strong>This action cannot be undone</strong> and the associated bot
						will stop working immediately.
					</DialogContentText>
				</DialogContent>
				<DialogActions className="px-6 pb-4">
					<Button
						onClick={handleDeleteCancel}
						color="secondary"
						disabled={actionLoading}
					>
						Cancel
					</Button>
					<Button
						onClick={confirmDelete}
						color="error"
						variant="contained"
						autoFocus
						disabled={actionLoading}
						startIcon={
							actionLoading ? (
								<CircularProgress size={16} color="inherit" />
							) : (
								<i className="tabler-trash" />
							)
						}
					>
						{actionLoading ? 'Deleting...' : 'Yes, Delete It'}
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default LicenseListPage;
