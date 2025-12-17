'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// MUI Imports
import Tab from '@mui/material/Tab';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';

// Components
import FeaturesForm from './FeaturesForm';
import ServerSettingsForm from './ServerSettingsForm';
import ActiveFeaturesCard from './ActiveFeaturesCard'; // <--- Import Component Baru

type Props = {
	guildId: string;
	settings: any;
};

const ServerConfigTabs = ({ guildId, settings }: Props) => {
	const router = useRouter();
	const searchParams = useSearchParams();

	const currentTab = searchParams.get('tab') || 'overview';
	const [activeTab, setActiveTab] = useState(currentTab);

	const handleChange = (event: React.SyntheticEvent, newValue: string) => {
		setActiveTab(newValue);
		router.push(`?tab=${newValue}`, { scroll: false });
	};

	// Fungsi helper buat pindah tab lewat tombol (misal: tombol Manage di card summary)
	const jumpToTab = (tabName: string) => {
		setActiveTab(tabName);
		router.push(`?tab=${tabName}`, { scroll: false });
	};

	const tabs = [
		{ value: 'overview', label: 'Overview', icon: 'tabler-info-circle' },
		{ value: 'features', label: 'Modules', icon: 'tabler-toggle-left' },
	];

	return (
		<TabContext value={activeTab}>
			<Grid container spacing={6}>
				{/* --- NAVIGASI TAB --- */}
				<Grid item xs={12}>
					<Card>
						<TabList
							onChange={handleChange}
							variant="scrollable"
							scrollButtons="auto"
							className="custom-tab-list"
						>
							{tabs.map((tab) => (
								<Tab
									key={tab.value}
									label={tab.label}
									value={tab.value}
									icon={<i className={tab.icon} />}
									iconPosition="start"
								/>
							))}
						</TabList>
					</Card>
				</Grid>

				{/* --- CONTENT AREA --- */}
				<Grid item xs={12}>
					{/* === TAB: OVERVIEW === */}
					<TabPanel value="overview" className="p-0">
						<Grid container spacing={6}>
							{/* Kolom Kiri: General Settings (Prefix/Lang) */}
							<Grid item xs={12} md={7}>
								<ServerSettingsForm
									guildId={guildId}
									initialSettings={settings}
								/>
							</Grid>

							{/* Kolom Kanan: Summary Fitur Aktif */}
							<Grid item xs={12} md={5}>
								<ActiveFeaturesCard
									settings={settings}
									onManageClick={() => jumpToTab('features')}
								/>
							</Grid>
						</Grid>
					</TabPanel>

					{/* === TAB: FEATURES === */}
					<TabPanel value="features" className="p-0">
						<FeaturesForm guildId={guildId} initialSettings={settings} />
					</TabPanel>
				</Grid>
			</Grid>
		</TabContext>
	);
};

export default ServerConfigTabs;
