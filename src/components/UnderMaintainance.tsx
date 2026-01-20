export default function UnderMaintainance() {
  return (
    <div className="h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-[#FF01ED] bg-linear-to-br from-[#29262E] to-[#0F0E11]">
      {/* Content */}
      <div className="relative max-w-2xl mx-auto text-center text-white">
        {/* 404 Number */}
        <div className="mb-2 md:mb-4 lg:mb-6 xl:mb-8">
          <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold [text-shadow:0_4px_12px_rgb(0_0_0/0.3)] dark:[text-shadow:0_4px_12px_rgb(255_255_255/0.3)]">
            503
          </h1>
        </div>

        {/* Heading */}
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium tracking-tight mb-4">
          Service Unavailable !!!
        </h2>

        {/* Description */}
        <p className="text-sm md:text-base max-w-lg mx-auto leading-relaxed mb-8">
          The page you&apos;re looking for is currently undergoing maintenance. <br/>
          It&apos;ll be back online shortly!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://www.linkedin.com/in/architkandu/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto bg-[#0966c2] text-white px-4 py-2 rounded-full"
          >
            Connect via LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
}
