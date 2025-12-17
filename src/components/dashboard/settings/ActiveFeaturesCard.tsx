'use client';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

// Mapping nama database ke nama cantik
const featureMap: Record<string, string> = {
	antiInviteOn: 'Anti Invite',
	antiLinkOn: 'Anti Link',
	antiSpamOn: 'Anti Spam',
	antiBadwordOn: 'Anti Badword',
	antiMentionOn: 'Anti Mention',
	antiAllCapsOn: 'Anti Caps',
	serverStatsOn: 'Server Stats',
	levelingOn: 'Leveling',
	welcomeInOn: 'Welcome Msg',
	welcomeOutOn: 'Goodbye Msg',
	streakOn: 'Streak',
	minecraftStatsOn: 'Minecraft',
	boostLogOn: 'Boost Log',
};

const ActiveFeaturesCard = ({
	settings,
	onManageClick,
}: {
	settings: any;
	onManageClick: () => void;
}) => {
	// Filter settings yang value-nya true DAN ada di featureMap
	const activeFeatures = Object.keys(settings).filter((key) => {
		return featureMap[key] && settings[key] === true;
	});

	return (
		<Card className="h-full">
			<CardHeader
				title="Active Modules"
				subheader={`${activeFeatures.length} features enabled`}
				action={
					<Button size="small" onClick={onManageClick}>
						Manage
					</Button>
				}
			/>
			<CardContent>
				{activeFeatures.length > 0 ? (
					<div className="flex flex-wrap gap-2">
						{activeFeatures.map((key) => (
							<Chip
								key={key}
								label={featureMap[key]}
								color="success"
								variant="outlined"
								icon={<i className="tabler-check" />}
								className="bg-success/10 border-success/20"
							/>
						))}
					</div>
				) : (
					<div className="text-center py-6 text-gray-500">
						<i className="tabler-plug-off text-4xl mb-2 opacity-50" />
						<Typography variant="body2">No features enabled yet.</Typography>
					</div>
				)}

				<Typography variant="caption" className="block mt-4 text-textDisabled">
					Go to "Modules" tab to enable more features.
				</Typography>
			</CardContent>
		</Card>
	);
};

export default ActiveFeaturesCard;
