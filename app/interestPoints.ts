export const interestPoints: {title, thing, coordinates: [number, number]}[] = [{
	coordinates: [-83.045754, 42.331427], title: "Detroit", thing: "Motoring",
}, {
	coordinates: [5.628929, 62.3317447], title: "Fosnavåg & Ulsteinvik", thing: "Shipping",
}, {
	coordinates: [114.1, 22.55], title: "Shenzhen", thing: "Electronics",
}, {
	coordinates: [-0.893753, 52.230375], title: "Northampton", thing: "Quality shoes",
}, {
	coordinates: [8.55, 47.366667], title: "Zürich", thing: "Banking & Watches", // Switzerland?
}, {
	coordinates: [-121.95749522570102, 37.29693300484994], title: "Silicon Valley", thing: "Cool innovations", // FIX COORDINATES!
},
]

export const cityCooridnates = interestPoints.map(x => x.coordinates)
