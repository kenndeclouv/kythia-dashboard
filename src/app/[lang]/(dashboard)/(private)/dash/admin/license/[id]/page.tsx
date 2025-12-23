'use client';

import { useState, useEffect, useCallback } from 'react';

import { useParams, useRouter } from 'next/navigation';

// MUI Imports
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import TablePagination from '@mui/material/TablePagination';
import Alert from '@mui/material/Alert';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import {
	Dialog,
	DialogContent,
	DialogTitle,
	IconButton,
	DialogActions,
	DialogContentText,
} from '@mui/material';
import { toast } from 'react-toastify';

// --- TYPES ---
type TelemetryLog = {
	id: string;
	level: string;
	message: string;
	metadata: string | null;
	createdAt: string;
};

type LicenseDetail = {
	id: string;
	key: string;
	ownerId: string;
	isActive: boolean;
	hwid: string | null;
	ipAddress: string | null;
	config: string | null;
	lastUsed: string;
	createdAt: string;
	logs: TelemetryLog[];
	boundClientId: string | null;
};

// --- CONFIG VIEWER COMPONENT ---
const ConfigViewer = ({ data }: { data: any }) => {
	if (!data)
		return (
			<Alert severity="info" variant="outlined">
				No configuration data synced.
			</Alert>
		);

	const { env, version, owner, addons, bot, db, api, settings, emojis } = data;

	// Helper: Render Value Pintar
	const renderValue = (val: any) => {
		if (val === null || val === undefined)
			return <span className="text-gray-400 italic">null</span>;
		if (typeof val === 'boolean')
			return (
				<Chip
					label={val ? 'True' : 'False'}
					size="small"
					color={val ? 'success' : 'error'}
					variant="outlined"
					className="h-5 text-[10px]"
				/>
			);
		if (Array.isArray(val))
			return (
				<div className="flex flex-wrap gap-1">
					{val.map((v, i) => (
						<Chip
							key={i}
							label={String(v)}
							size="small"
							className="h-5 text-[10px]"
						/>
					))}
				</div>
			);
		if (typeof val === 'object')
			return (
				<pre className="text-[10px] m-0 p-1 rounded break-all whitespace-pre-wrap">
					{JSON.stringify(val, null, 2)}
				</pre>
			);

		// Handle URL atau String Panjang
		const strVal = String(val);

		if (strVal.startsWith('http'))
			return (
				<a
					href={strVal}
					target="_blank"
					rel="noreferrer"
					className="text-primary hover:underline break-all"
				>
					{strVal}
				</a>
			);

		return <span className="text-sm break-all">{strVal}</span>;
	};

	// Helper: Row Key-Value
	const KeyValueRow = ({ label, value }: { label: string; value: any }) => (
		<div className="flex flex-col sm:flex-row sm:justify-between sm:items-start py-2 border-b border-dashed last:border-0 hover:bg-gray-50 dark:hover:bg-white/5 px-2 rounded transition-colors">
			<Typography
				variant="caption"
				className="font-medium text-textSecondary capitalize shrink-0 sm:w-1/3 mt-0.5"
			>
				{label.replace(/([A-Z])/g, ' $1').trim()}
			</Typography>
			<div className="text-left sm:text-right sm:w-2/3 w-full">
				{renderValue(value)}
			</div>
		</div>
	);

	const Section = ({
		title,
		icon,
		content,
		defaultExpanded = false,
	}: {
		title: string;
		icon: string;
		content: any;
		defaultExpanded?: boolean;
	}) => (
		<Accordion
			defaultExpanded={defaultExpanded}
			disableGutters
			elevation={0}
			className="border border-divider rounded-lg mb-3 before:hidden !bg-transparent"
		>
			<AccordionSummary expandIcon={<i className="tabler-chevron-down" />}>
				<div className="flex items-center gap-2">
					<i className={`${icon} text-lg`} />
					<Typography className="font-semibold">{title}</Typography>
				</div>
			</AccordionSummary>
			<AccordionDetails className="pt-0 pb-4">{content}</AccordionDetails>
		</Accordion>
	);

	return (
		<div className="flex flex-col">
			<Paper variant="outlined" className="p-4 bg-gray-50 dark:bg-white/5 mb-4">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					<div>
						<Typography variant="caption" color="textSecondary">
							Environment
						</Typography>
						<Typography
							variant="body2"
							className="font-bold uppercase text-primary"
						>
							{env}
						</Typography>
					</div>
					<div>
						<Typography variant="caption" color="textSecondary">
							Core Version
						</Typography>
						<Typography variant="body2" className="font-mono">
							{version}
						</Typography>
					</div>
					<div>
						<Typography variant="caption" color="textSecondary">
							Owner Name
						</Typography>
						<Typography variant="body2">{owner?.names}</Typography>
					</div>
					<div>
						<Typography variant="caption" color="textSecondary">
							Owner ID
						</Typography>
						<Typography variant="caption" className="font-mono block">
							{owner?.ids}
						</Typography>
					</div>
				</div>
			</Paper>

			{bot && (
				<Section
					title="Bot Identity"
					icon="tabler-robot"
					defaultExpanded
					content={
						<div className="grid grid-cols-1 gap-x-6">
							{Object.entries(bot).map(([k, v]) => (
								<KeyValueRow key={k} label={k} value={v} />
							))}
						</div>
					}
				/>
			)}

			{addons && (
				<Section
					title={`Addons (${Object.keys(addons).length})`}
					icon="tabler-puzzle"
					content={
						<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
							{Object.entries(addons).map(([name, config]: [string, any]) => (
								<Paper
									key={name}
									variant="outlined"
									className={`p-3 relative overflow-hidden transition-all hover:shadow-sm ${config.active ? 'border-primary/40 bg-primary/5' : 'opacity-60 grayscale'}`}
								>
									<div className="flex justify-between items-center mb-2 z-10 relative">
										<Typography className="font-bold capitalize flex items-center gap-2">
											{config.active ? (
												<i className="tabler-circle-check-filled text-success" />
											) : (
												<i className="tabler-circle-x-filled text-textSecondary" />
											)}
											{name}
										</Typography>
									</div>

									<div className="flex flex-col gap-1 z-10 relative pl-6">
										{Object.entries(config).map(
											([k, v]) =>
												k !== 'active' && (
													<div
														key={k}
														className="flex flex-col items-start text-xs border-l-2 pl-2 border-primary/20 my-1"
													>
														<span className="text-textSecondary opacity-75 font-medium">
															{k}
														</span>
														<span className="font-mono break-all">
															{typeof v === 'object'
																? JSON.stringify(v).substring(0, 30) +
																	(JSON.stringify(v).length > 30 ? '...' : '')
																: String(v)}
														</span>
													</div>
												),
										)}
										{Object.keys(config).length === 1 && (
											<span className="text-xs text-textSecondary italic">
												No extra config
											</span>
										)}
									</div>
								</Paper>
							))}
						</div>
					}
				/>
			)}

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{db && (
					<Section
						title="Database"
						icon="tabler-database"
						content={
							<div className="flex flex-col">
								{Object.entries(db).map(([k, v]) => (
									<KeyValueRow key={k} label={k} value={v} />
								))}
							</div>
						}
					/>
				)}
				{api && (
					<Section
						title="API Connections"
						icon="tabler-server"
						content={
							<div className="flex flex-col">
								{Object.entries(api).map(([k, v]) => (
									<KeyValueRow key={k} label={k} value={v} />
								))}
							</div>
						}
					/>
				)}
			</div>

			{settings && (
				<Section
					title="Global Settings"
					icon="tabler-settings"
					content={
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
							{Object.entries(settings).map(([k, v]) => (
								<KeyValueRow key={k} label={k} value={v} />
							))}
						</div>
					}
				/>
			)}

			{emojis && (
				<Section
					title="Emoji Mapping"
					icon="tabler-mood-smile"
					content={
						<div className="bg-[#1e1e1e] text-[#d4d4d4] p-4 rounded-lg overflow-auto max-h-[300px] font-mono text-xs">
							<pre>{JSON.stringify(emojis, null, 2)}</pre>
						</div>
					}
				/>
			)}
		</div>
	);
};

// --- MAIN PAGE ---
const LicenseDetailPage = () => {
	const params = useParams();
	const router = useRouter();
	const { id, lang } = params;

	const [license, setLicense] = useState<LicenseDetail | null>(null);
	const [loading, setLoading] = useState(true);
	const [metadataDialogOpen, setMetadataDialogOpen] = useState(false);
	const [selectedMetadata, setSelectedMetadata] = useState<any>(null);
	const [actionLoading, setActionLoading] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	// Fetch Function
	const fetchDetail = useCallback(async () => {
		try {
			const res = await fetch(`/api/v1/license/${id}`);

			if (!res.ok) throw new Error('Not found');

			const data = await res.json();

			setLicense(data);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	}, [id]);

	useEffect(() => {
		if (id) fetchDetail();
	}, [id, fetchDetail]);

	// Actions
	const handleToggleActive = async () => {
		if (!license) return;
		setActionLoading(true);

		try {
			const res = await fetch(`/api/v1/license/${id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ isActive: !license.isActive }),
			});

			if (res.ok) await fetchDetail();
		} catch (error) {
			console.error(error);
		} finally {
			setActionLoading(false);
		}
	};

	const handleResetBinding = () => {
		setResetBindingDialogOpen(true);
	};

	const handleResetBindingCancel = () => {
		if (!actionLoading) setResetBindingDialogOpen(false);
	};

	const confirmResetBinding = async () => {
		setActionLoading(true);

		try {
			// Kita pake endpoint PATCH yang sama, kirim boundClientId: null
			const res = await fetch(`/api/v1/license/${id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					boundClientId: null,
					ipAddress: null,
					hwid: null,
				}),
			});

			if (res.ok) {
				toast.success('License binding reset!');
				setResetBindingDialogOpen(false);
				await fetchDetail();
			}
		} catch (error) {
			console.error(error);
		} finally {
			setActionLoading(false);
		}
	};

	const [resetBindingDialogOpen, setResetBindingDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	// 1. Fungsi buat Buka Dialog (Dipasang di tombol Delete)
	const handleDeleteClick = () => {
		setDeleteDialogOpen(true);
	};

	// 2. Fungsi buat Tutup Dialog (Dipasang di tombol Cancel)
	const handleDeleteCancel = () => {
		if (!actionLoading) setDeleteDialogOpen(false);
	};

	// 3. Fungsi Eksekusi Delete (Dipasang di tombol "Yes, Delete")
	const confirmDelete = async () => {
		setActionLoading(true);

		try {
			const res = await fetch(`/api/v1/license/${id}`, { method: 'DELETE' });

			if (res.ok) {
				// Tutup dialog & cabut
				setDeleteDialogOpen(false);
				router.push(`/${lang}/dash/admin/license`);
			} else {
				alert('Gagal menghapus');
			}
		} catch (error) {
			console.error(error);
		} finally {
			setActionLoading(false);
		}
	};

	const handleViewMetadata = (metaString: string | null) => {
		if (!metaString) return;

		try {
			const parsed = JSON.parse(metaString);

			setSelectedMetadata(parsed);

			setMetadataDialogOpen(true);
		} catch (_e) {
			setSelectedMetadata(metaString);
			setMetadataDialogOpen(true);
		}
	};

	// Loading & Error States
	if (loading)
		return (
			<div className="flex h-[50vh] items-center justify-center">
				<CircularProgress />
			</div>
		);
	if (!license)
		return (
			<Alert severity="error" className="mt-4">
				License not found or access denied.
			</Alert>
		);

	// Parsers
	const parseJson = (str: string | null) => {
		if (!str) return null;
		try {
			return JSON.parse(str);
		} catch {
			return null;
		}
	};

	const hwidData = parseJson(license.hwid);
	const configData = parseJson(license.config);

	// Filter and paginate logs
	const filteredLogs = (license?.logs || []).filter((log) => {
		if (!searchQuery) return true;
		const query = searchQuery.toLowerCase();
		return (
			log.level.toLowerCase().includes(query) ||
			log.message.toLowerCase().includes(query) ||
			log.metadata?.toLowerCase().includes(query)
		);
	});

	const paginatedLogs = filteredLogs.slice(
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
		<Grid container spacing={6}>
			<Grid
				item
				xs={12}
				className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
			>
				<div>
					<div className="flex items-center gap-3">
						<Typography variant="h4">License Details</Typography>
						<Chip
							label={license.isActive ? 'Active' : 'Suspended'}
							color={license.isActive ? 'success' : 'error'}
							variant="tonal"
							size="small"
						/>
					</div>
					<Typography
						variant="body2"
						color="textSecondary"
						className="font-mono mt-1 opacity-75"
					>
						{license.id}
					</Typography>
				</div>

				<div className="flex gap-2 w-full sm:w-auto">
					<Button
						variant="outlined"
						color="secondary"
						onClick={() => router.push(`/${lang}/dash/admin/license`)}
						startIcon={<i className="tabler-arrow-left" />}
					>
						Back
					</Button>
					<Button
						variant="contained"
						color={license.isActive ? 'warning' : 'success'}
						onClick={handleToggleActive}
						disabled={actionLoading}
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
						variant="outlined"
						color="info"
						onClick={handleResetBinding}
						disabled={actionLoading || !license.boundClientId}
						startIcon={<i className="tabler-lock-open" />}
					>
						Reset Binding
					</Button>
					<Button
						variant="contained"
						color="error"
						onClick={handleDeleteClick}
						disabled={actionLoading}
						startIcon={<i className="tabler-trash" />}
					>
						Delete
					</Button>
				</div>
			</Grid>

			<Grid item xs={12} lg={6}>
				<Card className="h-full">
					<CardHeader
						title="License Information"
						avatar={
							<div className="p-2 bg-primary/10 rounded">
								<i className="tabler-id text-primary" />
							</div>
						}
					/>
					<Divider />
					<CardContent className="flex flex-col gap-4">
						<div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-white/5 rounded border border-dashed">
							<span className="text-sm font-semibold text-textSecondary">
								Key
							</span>
							<code className="font-mono text-primary font-bold">
								{license.key}
							</code>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<Typography variant="caption" color="textSecondary">
									Owner ID
								</Typography>
								<Typography variant="body2">{license.ownerId}</Typography>
							</div>
							<div>
								<Typography variant="caption" color="textSecondary">
									Created At
								</Typography>
								<Typography variant="body2">
									{new Date(license.createdAt).toLocaleDateString()}
								</Typography>
							</div>
							<div>
								<Typography variant="caption" color="textSecondary">
									Last IP
								</Typography>
								<Typography variant="body2" className="font-mono">
									{license.ipAddress || '-'}
								</Typography>
							</div>
							<div>
								<Typography variant="caption" color="textSecondary">
									Last Used
								</Typography>
								<Typography variant="body2">
									{new Date(license.lastUsed).toLocaleString()}
								</Typography>
							</div>
						</div>
					</CardContent>
				</Card>
			</Grid>

			<Grid item xs={12} lg={6}>
				<Card className="h-full">
					<CardHeader
						title="Hardware Spec (HWID)"
						avatar={
							<div className="p-2 bg-info/10 rounded">
								<i className="tabler-device-desktop text-info" />
							</div>
						}
					/>
					<Divider />
					<CardContent>
						{hwidData ? (
							<div className="grid grid-cols-2 gap-y-4 gap-x-2">
								<div className="col-span-2 p-3 bg-gray-50 dark:bg-white/5 rounded flex items-center gap-3">
									<i className="tabler-cpu text-2xl text-textSecondary" />
									<div>
										<Typography variant="caption" color="textSecondary">
											CPU Model
										</Typography>
										<Typography variant="body2" className="font-semibold">
											{hwidData.cpu}
										</Typography>
									</div>
								</div>

								<div>
									<Typography variant="caption" color="textSecondary">
										Hostname
									</Typography>
									<Typography variant="body2" className="font-medium">
										{hwidData.hostname}
									</Typography>
								</div>
								<div>
									<Typography variant="caption" color="textSecondary">
										Platform
									</Typography>
									<Typography
										variant="body2"
										className="font-medium capitalize"
									>
										{hwidData.platform}
									</Typography>
								</div>
								<div>
									<Typography variant="caption" color="textSecondary">
										RAM
									</Typography>
									<Typography variant="body2" className="font-medium">
										{hwidData.ram}
									</Typography>
								</div>
								<div>
									<Typography variant="caption" color="textSecondary">
										Bot Version
									</Typography>
									<Chip
										label={hwidData.botVersion}
										size="small"
										variant="outlined"
										className="h-6"
									/>
								</div>
							</div>
						) : (
							<div className="flex flex-col items-center justify-center h-[200px] text-textSecondary opacity-50">
								<i className="tabler-device-unknown text-4xl mb-2" />
								<Typography>No hardware data synced</Typography>
							</div>
						)}
					</CardContent>
				</Card>
			</Grid>

			<Grid item xs={12}>
				<Card>
					<CardHeader
						title="Synced Configuration"
						subheader="Last configuration received from the bot instance"
						avatar={
							<div className="p-2 bg-warning/10 rounded">
								<i className="tabler-settings-code text-warning" />
							</div>
						}
					/>
					<Divider />
					<CardContent>
						<ConfigViewer data={configData} />
					</CardContent>
				</Card>
			</Grid>

			<Grid item xs={12}>
				<Card>
					<CardHeader
						title="Telemetry Logs"
						subheader={`${filteredLogs.length} of ${license?.logs?.length || 0} events`}
						avatar={
							<div className="p-2 bg-error/10 rounded">
								<i className="tabler-activity-heartbeat text-error" />
							</div>
						}
					/>
					<Divider />
					<CardContent className="pb-0">
						<TextField
							fullWidth
							size="small"
							placeholder="Search logs by level, message or metadata..."
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
					<TableContainer className="max-h-[500px]">
						<Table stickyHeader size="small">
							<TableHead>
								<TableRow>
									<TableCell className="w-[100px]">Level</TableCell>
									<TableCell className="">Message</TableCell>

									<TableCell className="w-[120px]">Metadata</TableCell>
									<TableCell className="whitespace-nowrap w-[180px]">
										Time
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{paginatedLogs.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={4}
											className="text-center text-textSecondary py-8"
										>
											<div className="flex flex-col items-center gap-2">
												<i className="tabler-database-off text-4xl opacity-50" />
												<Typography variant="body2" color="textSecondary">
													{searchQuery
														? 'No logs match your search'
														: 'No telemetry logs available'}
												</Typography>
											</div>
										</TableCell>
									</TableRow>
								) : (
									paginatedLogs.map((log: TelemetryLog) => (
										<TableRow key={log.id} hover>
											<TableCell>
												<Chip
													label={log.level.toUpperCase()}
													size="small"
													color={
														log.level === 'error'
															? 'error'
															: log.level === 'warn'
																? 'warning'
																: 'info'
													}
													variant="tonal"
													className="h-6 text-[10px] font-bold"
												/>
											</TableCell>
											<TableCell className="text-sm font-medium">
												{log.message}
											</TableCell>

											<TableCell>
												{log.metadata ? (
													<Button
														variant="outlined"
														size="small"
														color="secondary"
														onClick={() => handleViewMetadata(log.metadata)}
														startIcon={<i className="tabler-code" />}
														className="py-1 px-2 min-w-0 h-7 text-[10px]"
													>
														View JSON
													</Button>
												) : (
													<span className="text-textSecondary text-xs opacity-50">
														-
													</span>
												)}
											</TableCell>

											<TableCell className="text-xs text-textSecondary whitespace-nowrap">
												{new Date(log.createdAt).toLocaleString()}
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
						count={filteredLogs.length}
						rowsPerPage={rowsPerPage}
						page={page}
						onPageChange={handleChangePage}
						onRowsPerPageChange={handleChangeRowsPerPage}
					/>
				</Card>
			</Grid>

			<Dialog
				open={metadataDialogOpen}
				onClose={() => setMetadataDialogOpen(false)}
				maxWidth="md"
				fullWidth
			>
				<DialogTitle className="flex justify-between items-center pb-2">
					<div className="flex items-center gap-2">
						<i className="tabler-json text-primary" />
						Log Metadata
					</div>
					<IconButton size="small" onClick={() => setMetadataDialogOpen(false)}>
						<i className="tabler-x" />
					</IconButton>
				</DialogTitle>
				<Divider />
				<DialogContent>
					{selectedMetadata ? (
						<div className="relative group">
							<div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
								<Tooltip title="Copy JSON">
									<IconButton
										size="small"
										className=" shadow-sm"
										onClick={() => {
											navigator.clipboard.writeText(
												JSON.stringify(selectedMetadata, null, 2),
											);
										}}
									>
										<i className="tabler-copy text-xs" />
									</IconButton>
								</Tooltip>
							</div>

							<pre className="text-xs font-mono p-4 rounded-lg overflow-auto max-h-[400px]">
								{JSON.stringify(selectedMetadata, null, 2)}
							</pre>
						</div>
					) : (
						<Typography color="textSecondary">No data available</Typography>
					)}
				</DialogContent>
			</Dialog>

			<Dialog
				open={resetBindingDialogOpen}
				onClose={handleResetBindingCancel}
				aria-labelledby="reset-dialog-title"
				aria-describedby="reset-dialog-description"
			>
				<DialogTitle
					id="reset-dialog-title"
					className="text-info flex items-center gap-2"
				>
					<i className="tabler-lock-open text-xl" />
					Confirm Reset Binding
				</DialogTitle>
				<DialogContent>
					<DialogContentText id="reset-dialog-description">
						Are you sure you want to reset the binding for this license?
						<br />
						This will allow the license to be used on a different bot instance.
						The current bot instance will be unbound.
					</DialogContentText>
				</DialogContent>
				<DialogActions className="px-6 pb-4">
					<Button
						onClick={handleResetBindingCancel}
						color="secondary"
						disabled={actionLoading}
					>
						Cancel
					</Button>
					<Button
						onClick={confirmResetBinding}
						color="info"
						variant="contained"
						autoFocus
						disabled={actionLoading}
						startIcon={
							actionLoading ? (
								<CircularProgress size={16} color="inherit" />
							) : (
								<i className="tabler-check" />
							)
						}
					>
						{actionLoading ? 'Resetting...' : 'Yes, Reset Binding'}
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
		</Grid>
	);
};

export default LicenseDetailPage;
