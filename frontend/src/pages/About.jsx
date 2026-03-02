import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      {/* Content Section */}
      <div className="w-full max-w-6xl px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Who We Are
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We are a passionate team committed to driving change through
              innovation and collaboration. Our Platform is designed to empower
              individuals and organizations to unlock their true potential.
            </p>
          </div>

          {/* Right (image) */}
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/3944426/pexels-photo-3944426.jpeg?_gl=1*yl10z8*_ga*MTkzNjMxMDg1NS4xNzUxODkxNzg4*_ga_8JE65Q40S6*czE3NzIwODY0MzkkbzUkZzAkdDE3NzIwODY0MzkkajYwJGwwJGgw"
              alt="Team working"
              className="rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="w-full bg-gray-100 py-12">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
          Meet Our Team
        </h2>

        {/* FIX: All members are now inside ONE grid container.
            On mobile (grid-cols-1) they stack, on desktop (md:grid-cols-3) they are in one row.
        */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto px-6">
          {/* Member 1 */}
          <div className="text-center group">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <img
                src="https://cdn-icons-png.flaticon.com/128/3135/3135715.png"
                alt="Jaime Lannister"
                className="w-full h-full rounded-full object-cover shadow-md group-hover:shadow-xl transition-shadow"
              />
            </div>
            <h3 className="text-xl font-semibold text-gray-700">
              Jaime Lannister
            </h3>
            <p className="text-blue-600 font-medium">CEO</p>
          </div>

          {/* Member 2 */}
          <div className="text-center group">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <img
                src="https://cdn-icons-png.flaticon.com/128/4140/4140037.png"
                alt="Cersei Lannister"
                className="w-full h-full rounded-full object-cover shadow-md group-hover:shadow-xl transition-shadow"
              />
            </div>
            <h3 className="text-xl font-semibold text-gray-700">
              Cersei Lannister
            </h3>
            <p className="text-blue-600 font-medium">CTO</p>
          </div>

          {/* Member 3 */}
          <div className="text-center group">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <img
                src="https://cdn-icons-png.flaticon.com/128/6997/6997662.png"
                alt="Daenerys Targaryen"
                className="w-full h-full rounded-full object-cover shadow-md group-hover:shadow-xl transition-shadow"
              />
            </div>
            <h3 className="text-xl font-semibold text-gray-700">
              Daenerys Targaryen
            </h3>
            <p className="text-blue-600 font-medium">Lead Designer</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;