import { Link } from '@inertiajs/react';

export default function Pagination({ links }) {
    if (links.length <= 3) return null;

    return (
        <div className="flex flex-wrap justify-center gap-1 mt-6">
            {links.map((link, key) => (
                link.url === null ? (
                    <div
                        key={key}
                        className="px-4 py-2 text-sm text-gray-400 bg-white border border-gray-100 rounded-xl"
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ) : (
                    <Link
                        key={key}
                        href={link.url}
                        className={`px-4 py-2 text-sm font-medium border rounded-xl transition-colors
                            ${link.active
                                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30'
                                : 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                )
            ))}
        </div>
    );
}
