'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { kythiaConfig } from '@config';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import PageHeader from '@/components/layout/front-pages/PageHeader';

const images = kythiaConfig.gallery;

const GalleryView = () => {
	const containerRef = useRef<HTMLDivElement>(null);
	const itemsRef = useRef<(HTMLImageElement | null)[]>([]);
	const highestZIndex = useRef(10);

	const randomizeImages = () => {
		if (!containerRef.current) return;

		const container = containerRef.current;
		const pW = container.offsetWidth;
		const pH = Math.max(container.offsetHeight, window.innerHeight) * 1.2;

		itemsRef.current.forEach((img) => {
			if (!img) return;

			const mobile = window.innerWidth < 700;
			const minSize = mobile ? 90 : 180;
			const maxSize = mobile ? 140 : 280;

			const w = Math.floor(Math.random() * (maxSize - minSize) + minSize);
			const h = w + Math.floor(Math.random() * 20 - 10);

			const padX = 30;
			const padY = 250;
			const left = Math.floor(Math.random() * (pW - w - padX * 2)) + padX;
			const top = Math.floor(Math.random() * (pH - h - padY * 2)) + padY;

			const rot = Math.random() * 30 - 15;

			img.style.width = `${w}px`;
			img.style.height = `${h}px`;
			img.style.left = `${left}px`;
			img.style.top = `${top}px`;
			img.style.transform = `rotate(${rot.toFixed(2)}deg)`;
			img.style.zIndex = (Math.floor(Math.random() * 5) + 2).toString();
		});
	};

	const handlePointerDown = (e: React.PointerEvent<HTMLImageElement>) => {
		const img = e.currentTarget;
		const container = containerRef.current;

		if (!container) return;

		e.preventDefault();

		highestZIndex.current += 1;
		img.style.zIndex = highestZIndex.current.toString();
		img.classList.add('dragging');
		img.setPointerCapture(e.pointerId);

		const rect = img.getBoundingClientRect();
		const containerRect = container.getBoundingClientRect();

		const offsetX = e.clientX - rect.left;
		const offsetY = e.clientY - rect.top;

		const onPointerMove = (moveEvent: PointerEvent) => {
			const newLeft = moveEvent.clientX - offsetX - containerRect.left;
			const newTop = moveEvent.clientY - offsetY - containerRect.top;

			img.style.left = `${newLeft}px`;
			img.style.top = `${newTop}px`;
		};

		const onPointerUp = (upEvent: PointerEvent) => {
			img.classList.remove('dragging');
			img.releasePointerCapture(upEvent.pointerId);

			window.removeEventListener('pointermove', onPointerMove);
			window.removeEventListener('pointerup', onPointerUp);
		};

		window.addEventListener('pointermove', onPointerMove);
		window.addEventListener('pointerup', onPointerUp);
	};

	useEffect(() => {
		const timer = setTimeout(() => {
			randomizeImages();
		}, 100);

		window.addEventListener('resize', randomizeImages);

		return () => {
			clearTimeout(timer);
			window.removeEventListener('resize', randomizeImages);
		};
		// biome-ignore lint/correctness/useExhaustiveDependencies: biome bug
	}, [randomizeImages]);

	return (
		<div
			ref={containerRef}
			className="relative min-h-[150vh] w-full overflow-hidden"
		>
			{/* Header Statis */}
			<div className="relative z-10 pt-32 pb-10 pointer-events-none">
				{/* pointer-events-none biar judul gak ngehalangin drag gambar dibawahnya */}
				<PageHeader
					logo
					title={
						<span>
							<span className="hero-title">Kythia&#39;s</span> Gallery
						</span>
					}
					subtitle="Drag, drop, and discover the fun! These are random memories."
					className="pointer-events-auto"
				/>
			</div>

			{/* Floating Images */}
			{images.map((src, i) => (
				<Image
					width={500}
					height={500}
					key={i}
					ref={(el) => {
						itemsRef.current[i] = el;
					}}
					src={src}
					alt={`Gallery ${i}`}
					onPointerDown={handlePointerDown}
					className="absolute object-cover rounded-2xl border-4 border-white bg-white shadow-xl cursor-grab active:cursor-grabbing transition-transform duration-200 select-none touch-none hover:scale-105 hover:brightness-110 hover:shadow-2xl"
					style={{
						top: '50%',
						left: '50%',
						width: 0,
						height: 0,
						opacity: 1,
						filter: 'brightness(95%) saturate(110%)',
					}}
					draggable={false}
				/>
			))}

			{/* Shuffle Button (Floating Bottom) */}
			<div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50">
				<Button
					variant="contained"
					size="large"
					onClick={randomizeImages}
					startIcon={<i className="tabler-dice text-2xl" />}
					className="rounded-full px-8 py-3 text-lg font-bold shadow-lg shadow-primary/40 hover:scale-105 transition-transform bg-white text-primary hover:bg-gray-100"
				>
					Scramble It!
				</Button>
			</div>

			{/* CSS Tambahan khusus page ini */}
			<style jsx global>{`
        .dragging {
          transform: scale(1.1) !important;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5) !important;
          z-index: 1000 !important;
          filter: brightness(110%) !important;
        }
      `}</style>
		</div>
	);
};

export default GalleryView;
