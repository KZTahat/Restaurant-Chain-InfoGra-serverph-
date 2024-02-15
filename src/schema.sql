create schema restaurant;

create table restaurant.basicInfo (
	id int auto_increment primary key,
	restaurantName varchar(30),
    phoneNumber varchar(15),
    streetName varchar(100),
    openingHours json,
    location varchar(255)
);

create table restaurant.landmarks (
	id int auto_increment primary key,
    restaurantId int,
    
    landmark varchar(255),
    
    foreign key (restaurantId) references restaurant.basicInfo(id)
);
 
create table restaurant.menu (
	id int auto_increment primary key,
	restaurantId int,
    
	menuItem varchar(255),
    servingTime varchar(255),
    
    foreign key (restaurantId) references restaurant.basicInfo(id)
);

create table restaurant.maintenance (
	id int auto_increment primary key,
    restaurantId int,
    
	startDate date,
    endDate date,
    impact ENUM('Complete shutdown', 'Partial shutdown', 'Normal operations'),
    maintenancePrice int,
    comments varchar(400),
    
    foreign key (restaurantId) references restaurant.basicInfo(id)
);



