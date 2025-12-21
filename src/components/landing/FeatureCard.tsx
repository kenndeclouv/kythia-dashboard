'use client';

import type React from 'react';
import { useState, useRef, type MouseEvent } from 'react'

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import classnames from 'classnames';

interface FeatureCardProps {
	title: string;
	desc: string;
	icon: string;
	color: string;
}

const Icon = ({ name, className }: { name: string; className?: string }) => (
	<i className={`tabler-${name} ${className}`} />
);

const FeatureCard: React.FC<FeatureCardProps> = ({
	title,
	desc,
	icon,
	color,
}) => {
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const [isHovered, setIsHovered] = useState(false);
	const cardRef = useRef<HTMLDivElement>(null);

	const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
		if (!cardRef.current) return;

		const rect = cardRef.current.getBoundingClientRect();
		setMousePosition({
			x: e.clientX - rect.left,
			y: e.clientY - rect.top,
		});
	};

	return (
		<div
			ref={cardRef}
			onMouseMove={handleMouseMove}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			className="h-full"
		>
			<Card
				className={classnames(
					'h-full relative overflow-hidden transition-all duration-300 ease-out border bg-white/[0.02] glass',
					isHovered
						? 'transform -translate-y-2 shadow-2xl border-white/20'
						: 'border-white/5 shadow-lg',
				)}
			>
				{/* Drag Handle */}
				<div className="drag-handle absolute top-4 right-4 z-20 cursor-grab active:cursor-grabbing p-2 rounded-lg hover:bg-white/10 transition-colors">
					<Icon name="grip-vertical" className="text-xl text-gray-500" />
				</div>

				{/* Spotlight Glow Effect */}
				<div
					className="pointer-events-none absolute -inset-px transition duration-300 opacity-0 group-hover:opacity-100"
					style={{
						background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(var(--mui-palette-${color}-mainChannel), 0.1), transparent 40%)`,
						opacity: isHovered ? 1 : 0,
					}}
				/>

				<CardContent className="p-6 text-center relative z-10">
					<div
						className={classnames(
							`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center text-3xl transition-all duration-500`,
							`bg-${color}/10 text-${color}`,
							isHovered ? 'scale-110 rotate-3 shadow-lg' : '',
						)}
					>
						<Icon name={icon} className="text-4xl" />
					</div>
					<h3
						className={classnames(
							'text-xl font-bold mb-3 transition-colors duration-300',
							isHovered ? `text-${color}` : 'text-white',
						)}
					>
						{title}
					</h3>
					<p className="text-gray-400 leading-relaxed">{desc}</p>
				</CardContent>
			</Card>
		</div>
	);
};

export default FeatureCard;
