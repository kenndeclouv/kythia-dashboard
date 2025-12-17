import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';

import Chip from '@mui/material/Chip';

import classnames from 'classnames';

import frontCommonStyles from '@views/front-pages/styles.module.css';

import { fetchAPI } from '@/libs/api';
import PageHeader from '@/components/layout/front-pages/PageHeader';

export default async function ChangelogPage() {
	const changelogs =
		(await fetchAPI('/meta/changelog', { revalidate: 86400 })) || [];

	return (
		<section id="contact-us" className="plb-[100px]">
			<div
				className={classnames('flex flex-col', frontCommonStyles.layoutSpacing)}
			>
				<div className="flex flex-col gap-y-4 items-center justify-center ">
					<div className="min-h-screen">
						{/* Header */}
						<PageHeader
							logo
							title={
								<span>
									<span className="hero-title">Kythia&#39;s</span> Changelog
								</span>
							}
							subtitle={<span>Latest updates and improvements</span>}
						/>

						<div className="mx-auto flex flex-col gap-2 w-full max-w-5xl">
							{changelogs.length > 0 ? (
								changelogs.map((entry: any, index: number) => (
									<Accordion
										key={index}
										defaultExpanded={index === 0}
										className="border border-white/10 glass bg-white/[0.02]"
									>
										<AccordionSummary
											expandIcon={<i className="tabler-chevron-down " />}
										>
											<div className="flex items-center justify-between w-full pr-4">
												<div className="flex items-center gap-3">
													<Chip
														label={`v${entry.version}`}
														color="primary"
														size="small"
													/>
												</div>
												<Typography variant="caption" className="text-gray-400">
													{entry.date}
												</Typography>
											</div>
										</AccordionSummary>

										<AccordionDetails className="pt-6">
											<div
												className="prose prose-invert max-w-none text-sm"
												dangerouslySetInnerHTML={{ __html: entry.html }}
											/>
										</AccordionDetails>
									</Accordion>
								))
							) : (
								<div className="text-center text-gray-500">No logs found.</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
