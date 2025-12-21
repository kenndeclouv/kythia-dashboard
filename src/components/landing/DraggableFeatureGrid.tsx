'use client';

import React from 'react';
import { useDragAndDrop } from '@formkit/drag-and-drop/react';
import FeatureCard from './FeatureCard';

interface Feature {
	title: string;
	desc: string;
	icon: string;
	color: string;
}

interface DraggableFeatureGridProps {
	initialFeatures: Feature[];
}

const DraggableFeatureGrid: React.FC<DraggableFeatureGridProps> = ({
	initialFeatures,
}) => {
	const [parent, features] = useDragAndDrop<HTMLDivElement, Feature>(
		initialFeatures,
		{
			sortable: true,
			dragHandle: '.drag-handle', // Optional: if we want a specific handle, but for now we'll make the whole card draggable or just use the default
		},
	);

	return (
		<div
			ref={parent}
			className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
		>
			{features.map((f) => (
				<div key={f.title} className="h-full">
					<FeatureCard {...f} />
				</div>
			))}
		</div>
	);
};

export default DraggableFeatureGrid;
