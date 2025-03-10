const ServiceCard = ({ service }) => {
    return (
      <div
        className="bg-white cursor-pointer rounded-lg shadow-lg p-4 transform transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:bg-blue-50"
      >
        <img
          alt="img services"
          className="h-40 w-full object-cover rounded-md mb-4"
          src={service.images ? service.images[0] : service.img_link}
          loading="lazy"
        />
        <h2 className="text-center text-lg font-semibold text-blue-900 hover:text-blue-600 capitalize">
          {service.name}
        </h2>
      </div>
    );
  };
  
  export default ServiceCard;
  