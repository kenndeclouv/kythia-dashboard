// src/app/[lang]/(marketing)/privacy/page.tsx

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import classnames from 'classnames';

import PageHeader from '@/components/layout/front-pages/PageHeader';
import frontCommonStyles from '@views/front-pages/styles.module.css';

export const metadata = {
	title: 'Privacy Policy - Kythia',
	description: 'How Kythia collects and handles your data.',
};

export default function PrivacyPage() {
	return (
		<section className="plb-[100px]">
			<div
				className={classnames('flex flex-col', frontCommonStyles.layoutSpacing)}
			>
				{/* --- HEADER --- */}
				<PageHeader
					logo
					title={<span className="hero-title">Privacy Policy</span>}
					subtitle="Kythia is committed to protecting your privacy."
				/>

				{/* --- CONTENT CARD --- */}
				<div className="flex justify-center">
					<Card className="glass bg-white/[0.02] border border-white/10 w-full max-w-5xl">
						<CardContent className="p-8 md:p-12 text-textSecondary space-y-6">
							<div>
								<Typography
									variant="caption"
									className="text-textDisabled block mb-4"
								>
									Last updated: 6 August 2025
								</Typography>
								<Typography>
									This Privacy Policy explains how <b>Kythia</b> collects, uses,
									and discloses information when you use the Kythia Discord bot
									and its associated services and website (&quot;Service&quot;).
								</Typography>
							</div>

							<Divider className="border-white/5" />

							<div className="mb-6">
								<Typography
									variant="h4"
									className="font-bold text-textPrimary mb-2"
								>
									1. Information We Collect
								</Typography>
								<Typography paragraph>
									We only collect data that is necessary for the Service to
									function properly. We do <b>NOT</b>
									store message content that is unrelated to a command.
								</Typography>

								<Typography variant="h6" className="text-white mt-4 mb-2">
									Information Collected Automatically via Discord:
								</Typography>
								<ul className="list-disc pl-5 space-y-1 mb-4">
									<li>
										<strong>User IDs:</strong> To identify users for features
										like economy, leveling, and user-specific settings.
									</li>
									<li>
										<strong>Guild (Server) IDs:</strong> To identify servers and
										store server-specific settings.
									</li>
									<li>
										<strong>Channel IDs:</strong> To identify specific channels
										for features like logging or welcome messages.
									</li>
									<li>
										<strong>Role IDs:</strong> For permission-based commands and
										auto-role features.
									</li>
									<li>
										<strong>Command Usage:</strong> We may log which commands
										are used to improve the Service.
									</li>
								</ul>

								<Typography variant="h6" className="text-white mt-4 mb-2">
									Information You Provide Voluntarily:
								</Typography>
								<ul className="list-disc pl-5 space-y-1 mb-4">
									<li>
										<strong>Server Configurations:</strong> Settings configured
										by admins (e.g., welcome messages, rules).
									</li>
									<li>
										<strong>User-Generated Content:</strong> Data generated
										through bot features like profiles or inventory.
									</li>
								</ul>

								<Typography variant="h6" className="text-white mt-4 mb-2">
									Information from the Dashboard:
								</Typography>
								<ul className="list-disc pl-5 space-y-1">
									<li>
										<strong>Cookies and Session Data:</strong> Used to keep you
										authenticated on the dashboard, linked to your Discord
										profile.
									</li>
								</ul>
							</div>

							<Divider className="border-white/5" />

							<div className="mb-6">
								<Typography
									variant="h4"
									className="font-bold text-textPrimary mb-2"
								>
									2. How We Use Your Information
								</Typography>
								<Typography className="mb-2">
									We use the collected information for the following purposes:
								</Typography>
								<ul className="list-disc pl-5 space-y-1">
									<li>
										To provide, maintain, and improve the core functionality of
										the Service.
									</li>
									<li>
										To personalize your experience (e.g., showing your level or
										balance).
									</li>
									<li>
										To provide customer support and respond to your inquiries.
									</li>
									<li>
										To monitor the usage of the Service for performance and
										security analysis.
									</li>
								</ul>
							</div>

							<Divider className="border-white/5" />

							<div className="mb-6">
								<Typography
									variant="h4"
									className="font-bold text-textPrimary mb-2"
								>
									3. Data Storage and Security
								</Typography>
								<Typography>
									All data is stored on secure servers. We take reasonable
									measures to protect your information from unauthorized access,
									loss, or misuse. However, no internet-based service can be
									100% secure.
								</Typography>
							</div>

							<Divider className="border-white/5" />

							<div className="mb-6">
								<Typography
									variant="h4"
									className="font-bold text-textPrimary mb-2"
								>
									4. Data Retention
								</Typography>
								<Typography paragraph>
									We retain data for as long as it is necessary to provide the
									Service.
								</Typography>
								<ul className="list-disc pl-5 space-y-1">
									<li>
										Server-specific settings are retained until the bot is
										removed from the server.
									</li>
									<li>
										User-generated data is retained until the user requests data
										deletion.
									</li>
									<li>
										Transient data like command logs may be cleared
										periodically.
									</li>
								</ul>
							</div>

							<Divider className="border-white/5" />

							<div className="mb-6">
								<Typography
									variant="h4"
									className="font-bold text-textPrimary mb-2"
								>
									5. Data Sharing
								</Typography>
								<Typography>
									We do not sell, trade, or otherwise transfer your personally
									identifiable information to outside parties. This does not
									include trusted third parties who assist us in operating our
									Service (like our hosting provider), so long as those parties
									agree to keep this information confidential.
								</Typography>
							</div>

							<Divider className="border-white/5" />

							<div className="mb-6">
								<Typography
									variant="h4"
									className="font-bold text-textPrimary mb-2"
								>
									6. Your Rights
								</Typography>
								<Typography paragraph>
									You have the right to request access to or deletion of your
									personal data. To do so, please contact us through our
									official support channels.
								</Typography>
								<Typography>
									To request data deletion for a server, the server owner must
									remove the bot from the server. This will automatically
									trigger the deletion of server-specific configurations.
								</Typography>
							</div>

							<Divider className="border-white/5" />

							<div className="mb-6">
								<Typography
									variant="h4"
									className="font-bold text-textPrimary mb-2"
								>
									7. Children&#39;s Privacy
								</Typography>
								<Typography>
									Our Service does not knowingly collect any personally
									identifiable information from children under the age of 13. If
									you believe we have collected such information, please contact
									us immediately.
								</Typography>
							</div>

							<Divider className="border-white/5" />

							<div className="mb-6">
								<Typography
									variant="h4"
									className="font-bold text-textPrimary mb-2"
								>
									8. Contact Us
								</Typography>
								<Typography>
									If you have any questions about this Privacy Policy, please
									contact us at{' '}
									<a
										href="mailto:me@kenn.my.id"
										className="text-primary hover:underline"
									>
										me@kenn.my.id
									</a>{' '}
									or by joining our{' '}
									<a
										href="https://dsc.gg/kythia"
										target="_blank"
										rel="noopener noreferrer"
										className="text-primary hover:underline"
									>
										Support Server
									</a>
									.
								</Typography>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</section>
	);
}
