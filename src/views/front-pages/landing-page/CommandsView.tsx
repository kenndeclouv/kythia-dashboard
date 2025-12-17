'use client';

import { useState, useMemo } from 'react';

import Grid from '@mui/material/Grid';

import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';

import TableRow from '@mui/material/TableRow';

import PageHeader from '@/components/layout/front-pages/PageHeader';

type CommandOption = {
	name: string;
	description: string;
	type: string;
	required: boolean;
	choices?: string;
};

type SubCommand = {
	name: string;
	description: string;
	options?: CommandOption[];
	aliases?: string[];
};

type Command = {
	name: string;
	description: string;
	category: string;
	type: 'slash' | 'user' | 'message';
	isContextMenu?: boolean;
	options?: CommandOption[];
	subcommands?: SubCommand[];
};

type Props = {
	commands: Command[];
	categories: string[];
	totalCommands: number;
};

const CommandsView = ({ commands, categories, totalCommands }: Props) => {
	const [search, setSearch] = useState('');
	const [activeCategory, setActiveCategory] = useState('all');

	const filteredData = useMemo(() => {
		const term = search.toLowerCase();

		return commands.filter((cmd) => {
			if (activeCategory !== 'all' && cmd.category !== activeCategory)
				return false;

			return (
				cmd.name.toLowerCase().includes(term) ||
				cmd.description.toLowerCase().includes(term)
			);
		});
	}, [commands, search, activeCategory]);

	const renderOptionsTable = (options: CommandOption[]) => (
		<TableContainer className="rounded border border-divider mt-3">
			<Table size="small">
				<TableHead>
					<TableRow>
						<TableCell>Option</TableCell>
						<TableCell>Description</TableCell>
						<TableCell>Type</TableCell>
						<TableCell align="center">Required</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{options.map((opt, i) => (
						<TableRow key={i} hover>
							<TableCell>
								<code className="text-primary font-bold">{opt.name}</code>
							</TableCell>
							<TableCell>
								{opt.description}
								{opt.choices && (
									<div className="text-xs text-textPrimary mt-1">
										Choice: {opt.choices}
									</div>
								)}
							</TableCell>
							<TableCell>
								<Chip label={opt.type} size="small" variant="outlined" />
							</TableCell>
							<TableCell align="center">{opt.required ? '✅' : '❌'}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);

	return (
		<div className="container mx-auto pb-20">
			<PageHeader
				logo
				title={
					<span>
						<span className="hero-title">Kythia&#39;s</span> Commands
					</span>
				}
				subtitle={
					<span>Explore all {totalCommands} kythia&apos;s commands</span>
				}
			/>

			<Grid container spacing={6}>
				<Grid item xs={12} lg={3}>
					<div className="sticky top-24 border border-white/10 bg-white/[0.02] glass">
						<Typography
							variant="h6"
							className="mb-4 mt-4 ms-4 font-bold uppercase text-textPrimary tracking-widest"
						>
							Categories
						</Typography>
						<div className="flex flex-col gap-2">
							<Button
								variant={activeCategory === 'all' ? 'contained' : 'text'}
								color="primary"
								className="justify-between rounded-none"
								onClick={() => setActiveCategory('all')}
							>
								All Commands
								<Chip
									label={totalCommands}
									size="small"
									color={activeCategory === 'all' ? 'default' : 'primary'}
								/>
							</Button>

							{categories.map((cat) => {
								const count = commands
									.filter((c) => c.category === cat)
									.reduce((acc, cmd) => {
										if (cmd.subcommands && cmd.subcommands.length > 0) {
											return acc + cmd.subcommands.length;
										}

										return acc + 1;
									}, 0);

								return (
									<Button
										key={cat}
										variant={activeCategory === cat ? 'contained' : 'text'}
										color="primary"
										className={`justify-between capitalize rounded-none ${activeCategory === cat ? '' : 'text-textPrimary hover:bg-actionHover'}`}
										onClick={() => setActiveCategory(cat)}
									>
										{cat.replace(/_/g, ' ')}
										<Chip
											label={count}
											size="small"
											className="bg-actionSelected"
										/>
									</Button>
								);
							})}
						</div>
					</div>
				</Grid>

				<Grid item xs={12} lg={9}>
					<TextField
						fullWidth
						placeholder="Search command name or description..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="mb-6 bg-white/[0.02] glass border border-white/10"
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<i className="tabler-search" />
								</InputAdornment>
							),
						}}
					/>

					<div className="flex flex-col gap-2">
						{filteredData.length > 0 ? (
							filteredData.map((cmd, index) => (
								<Accordion
									key={index}
									className="border border-white/10 bg-white/[0.02] glass "
								>
									<AccordionSummary
										expandIcon={<i className="tabler-chevron-down" />}
									>
										<div className="flex items-center gap-3 w-full">
											{cmd.isContextMenu ? (
												<i
													className={
														cmd.type === 'user'
															? 'tabler-user'
															: 'tabler-message'
													}
												/>
											) : (
												<span className="text-primary font-mono text-xl font-bold">
													<i className="tabler-slash"></i>
												</span>
											)}

											<Typography className="font-bold text-lg">
												{cmd.name}
											</Typography>

											<Chip
												label={cmd.category}
												size="small"
												variant="outlined"
												className="ml-auto mr-4"
											/>
										</div>
									</AccordionSummary>

									<AccordionDetails>
										<Typography className="mb-4 text-textPrimary border-l-4 border-primary pl-4 py-1">
											{cmd.description}
										</Typography>

										{cmd.subcommands && cmd.subcommands.length > 0 && (
											<div className="mt-4">
												<Typography
													variant="subtitle2"
													className="uppercase mb-2 font-bold text-primary"
												>
													Subcommands
												</Typography>
												{cmd.subcommands.map((sub, idx) => (
													<div
														key={idx}
														className="mb-6 p-4  rounded-lg border border-divider"
													>
														<div className="flex items-center gap-2 mb-2">
															<code className="text-lg font-bold">
																/{cmd.name} {sub.name}
															</code>
															{sub.aliases && sub.aliases.length > 0 && (
																<span className="text-xs text-textDisabled">
																	(Aliases: {sub.aliases.join(', ')})
																</span>
															)}
														</div>
														<Typography className="mb-3 text-sm">
															{sub.description}
														</Typography>

														{sub.options &&
															sub.options.length > 0 &&
															renderOptionsTable(sub.options)}
													</div>
												))}
											</div>
										)}

										{cmd.options && cmd.options.length > 0 && (
											<div className="mt-4">
												<Typography
													variant="subtitle2"
													className="uppercase mb-2 font-bold text-primary"
												>
													Options
												</Typography>
												{renderOptionsTable(cmd.options)}
											</div>
										)}
									</AccordionDetails>
								</Accordion>
							))
						) : (
							<div className="text-center py-20 opacity-50">
								<i className="tabler-search text-6xl mb-4" />
								<Typography variant="h5">No commands found</Typography>
								<Typography>Try adjusting your search or filter</Typography>
							</div>
						)}
					</div>
				</Grid>
			</Grid>
		</div>
	);
};

export default CommandsView;
