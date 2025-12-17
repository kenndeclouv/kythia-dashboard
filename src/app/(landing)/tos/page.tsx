// src/app/[lang]/(marketing)/tos/page.tsx

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import classnames from 'classnames';

import PageHeader from '@/components/layout/front-pages/PageHeader';
import frontCommonStyles from '@views/front-pages/styles.module.css';

export const metadata = {
	title: 'Terms of Service - Kythia',
	description: 'Terms and conditions for using Kythia Discord Bot.',
};

export default function TosPage() {
	return (
		<section className="plb-[100px]">
			<div
				className={classnames('flex flex-col', frontCommonStyles.layoutSpacing)}
			>
				{/* --- HEADER --- */}
				<PageHeader
					logo
					title={<span className="hero-title">Terms of Service</span>}
					subtitle="Please read these Terms carefully before using Kythia."
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
									Please read these Terms of Service (&quot;Terms&quot;)
									carefully before using the Kythia Discord bot and its
									associated services and website (&quot;Service&quot;),
									operated by <b>kenndeclouv</b>.
								</Typography>
								<Typography className="mt-2">
									Your access to and use of the Service is conditioned upon your
									acceptance of and compliance with these Terms. By adding
									Kythia to your Discord server or using our Service, you agree
									to be bound by these Terms.
								</Typography>
							</div>

							<Divider className="border-white/5" />

							<div className="mb-6">
								<Typography
									variant="h4"
									className="font-bold text-textPrimary mb-2"
								>
									1. Use of the Service
								</Typography>
								<Typography className="mb-2">
									You agree not to use the Service for any purpose that is
									illegal or prohibited by these Terms. You are responsible for
									your conduct and any content you generate using the Service.
									You agree not to:
								</Typography>
								<ul className="list-disc pl-5 space-y-2">
									<li>
										Abuse the Service&#39;s features, including spamming
										commands.
									</li>
									<li>
										Attempt to exploit bugs or vulnerabilities in the Service.
									</li>
									<li>Use the Service to harass, defame, or harm others.</li>
									<li>
										Violate Discord&#39;s Terms of Service or Community
										Guidelines through your use of our Service.
									</li>
								</ul>
							</div>

							<Divider className="border-white/5" />

							<div className="mb-6">
								<Typography
									variant="h4"
									className="font-bold text-textPrimary mb-2"
								>
									2. Intellectual Property & Copyright
								</Typography>
								<Typography paragraph>
									The Service and its original content, features, and
									functionality are and will remain the exclusive property of{' '}
									<b>kenndeclouv</b>. The Service is protected by copyright and
									other laws.
								</Typography>

								{/* --- BAGIAN COPYRIGHT ASSET YANG DIPERTEGAS --- */}
								<div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
									<Typography
										variant="subtitle1"
										className="font-bold text-primary mb-1"
									>
										🎨 Artwork & Assets Rights
									</Typography>
									<Typography variant="body2" className="text-textSecondary">
										Specific visual assets, including but not limited to the{' '}
										<b>
											Kythia Character Design, Profile Pictures (Avatars), and
											Logos
										</b>
										, are the intellectual property of the owner. While AI tools
										may have been utilized in the initial generation process,
										<b>
											significant human editing, retouching, and creative
											direction
										</b>{' '}
										have been applied to create the final distinct assets.
									</Typography>
									<Typography
										variant="body2"
										className="text-textSecondary mt-2 font-bold"
									>
										Unauthorized use, reproduction, or claiming these assets as
										your own (e.g., using Kythia&apos;s avatar as your personal
										profile picture) is strictly prohibited and may result in a
										blacklist from our services.
									</Typography>
								</div>
							</div>

							<Divider className="border-white/5" />

							<div className="mb-6">
								<Typography
									variant="h4"
									className="font-bold text-textPrimary mb-2"
								>
									3. Termination
								</Typography>
								<Typography paragraph>
									We may terminate or suspend your access to our Service
									immediately, without prior notice or liability, for any reason
									whatsoever, including without limitation if you breach the
									Terms.
								</Typography>
								<Typography>
									We reserve the right to prevent any Discord server or user
									from using the Service at our sole discretion.
								</Typography>
							</div>

							<Divider className="border-white/5" />

							<div className="mb-6">
								<Typography
									variant="h4"
									className="font-bold text-textPrimary mb-2"
								>
									4. Disclaimers and Limitation of Liability
								</Typography>
								<Typography paragraph>
									The Service is provided on an &quot;AS IS&quot; and &quot;AS
									AVAILABLE&quot; basis. We do not warrant that the service will
									be uninterrupted, secure, or error-free.
								</Typography>
								<Typography>
									In no event shall <b>kenndeclouv</b> be liable for any
									indirect, incidental, special, consequential or punitive
									damages, including without limitation, loss of data, goodwill,
									or other intangible losses, resulting from your access to or
									use of or inability to access or use the Service.
								</Typography>
							</div>

							<Divider className="border-white/5" />

							<div className="mb-6">
								<Typography
									variant="h4"
									className="font-bold text-textPrimary mb-2"
								>
									5. Changes to These Terms
								</Typography>
								<Typography>
									We reserve the right, at our sole discretion, to modify or
									replace these Terms at any time. We will provide notice of any
									changes by posting the new Terms on this page. By continuing
									to access or use our Service after those revisions become
									effective, you agree to be bound by the revised terms.
								</Typography>
							</div>

							<Divider className="border-white/5" />

							<div className="mb-6">
								<Typography
									variant="h4"
									className="font-bold text-textPrimary mb-2"
								>
									6. Contact Us
								</Typography>
								<Typography>
									If you have any questions about these Terms, please contact me
									at{' '}
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
										className="text-primary hover:underline"
										rel="noopener"
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
