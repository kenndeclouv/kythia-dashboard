'use client';

import React from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';

interface TrustedByMarqueeProps {
	guilds: any[];
}

const TrustedByMarquee = ({ guilds }: TrustedByMarqueeProps) => {
	const [emblaRef] = useEmblaCarousel({ loop: true, dragFree: true }, [
		AutoScroll({ playOnInit: true, stopOnInteraction: false, speed: 1 }),
	]);

	return (
		<div className="relative overflow-hidden" ref={emblaRef}>
			<div className="flex touch-pan-y py-12">
				{guilds.map((guild: any, i: number) => (
					<div
						key={i}
						className="flex flex-[0_0_auto] me-8 min-w-0 items-center gap-4 glass bg-white/[0.02] border border-white/5 px-6 py-4 rounded-2xl hover:border-primary/50 transition-colors select-none cursor-grab active:cursor-grabbing"
					>
						{guild.icon ? (
							<div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20">
								<Image
									src={guild.icon}
									alt={guild.name}
									fill
									className="object-cover"
									unoptimized
								/>
							</div>
						) : (
							<div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl border-2 border-primary/20">
								{guild.name.charAt(0)}
							</div>
						)}
						<div className="flex flex-col">
							<span className="font-bold text-lg">{guild.name.slice(0, 16)}</span>
							<span className="text-sm text-gray-400">
								<span className="text-primary">
									{guild.memberCount.toLocaleString()}
								</span>{' '}
								members
							</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default TrustedByMarquee;
