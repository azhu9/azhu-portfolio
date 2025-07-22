// import React from "react";

const Map = () => {
  return (
    <div className="w-full h-full background">
      <iframe
        className="w-full h-full rounded-2xl filter brightness-100 contrast-110"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3034.9768765711606!2d-74.43154332254615!3d40.47577657143027!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c3c65518be06bf%3A0x51b42066917aaf48!2sRutgers%20University%E2%80%93New%20Brunswick!5e0!3m2!1sen!2sus!4v1752968206718!5m2!1sen!2sus"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
};

export default Map;
