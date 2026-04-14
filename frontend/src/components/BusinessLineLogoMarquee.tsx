'use client';

import { type BrandLogoGroup } from '@/lib/photobooth-brand-logos';

type BusinessLineLogoMarqueeProps = {
	groups: BrandLogoGroup[];
	accent?: string;
};

function LogoRow({ title, items, accent }: BusinessLineLogoMarqueeProps['groups'][number] & { accent?: string }) {
	const track = [...items, ...items];

	return (
		<div className="space-y-4">
			<div className="flex items-end justify-between gap-4 px-1">
				<h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-white/80">{title}</h3>
				<span className="text-xs text-white/45">CMS managed</span>
			</div>
			<div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
				<div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-slate-950 to-transparent z-10" />
				<div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-slate-950 to-transparent z-10" />
				<div className="logo-marquee-track flex items-center gap-6 py-5 px-6 w-max">
					{track.map((logo, index) => (
						<div
							key={`${logo.id}-${index}`}
							className="flex items-center justify-center rounded-2xl border border-white/10 bg-slate-950/80 px-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]"
							style={{
								minWidth: `${Math.max(180, (logo.display_width || 150) + 30)}px`,
								height: `${Math.max(80, (logo.display_height || 64) + 16)}px`,
								boxShadow: accent ? `0 0 24px ${accent}18` : undefined,
							}}
						>
							<img
								src={logo.image_url}
								alt={logo.alt_text || logo.name}
								className="object-contain opacity-90 transition-transform duration-300 hover:scale-105"
								style={{
									width: `${logo.display_width || 150}px`,
									height: `${logo.display_height || 64}px`,
								}}
							/>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export function BusinessLineLogoMarquee({ groups, accent = '#ff006e' }: BusinessLineLogoMarqueeProps) {
	if (groups.length === 0) {
		return null;
	}

	return (
		<section className="relative z-10 py-16 px-4 max-w-6xl mx-auto">
			<div className="mb-8 text-center">
				<p className="text-xs uppercase tracking-[0.45em] text-white/50">Brand network</p>
				<h2 className="mt-3 text-3xl md:text-4xl font-semibold text-white">Our Partner & Our Client</h2>
			</div>

			<div className="space-y-10">
				{groups.map((group) => (
					<LogoRow key={group.section} section={group.section} title={group.title} items={group.items} accent={accent} />
				))}
			</div>

			<style jsx global>{`
				@keyframes logo-marquee-ltr {
					0% {
						transform: translate3d(-50%, 0, 0);
					}
					100% {
						transform: translate3d(0, 0, 0);
					}
				}

				.logo-marquee-track {
					animation: logo-marquee-ltr 28s linear infinite;
					will-change: transform;
				}

				.logo-marquee-track:hover {
					animation-play-state: paused;
				}
			`}</style>
		</section>
	);
}