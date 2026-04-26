import { VideoCard } from './VideoCard';

export function VideoGrid({ videos }) {
  return (
    <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4 space-y-4">
      {videos.map(video => (
        <div key={video.id} className="break-inside-avoid">
          <VideoCard video={video} />
        </div>
      ))}
    </div>
  );
}
