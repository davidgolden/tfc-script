import {useEffect, useState, useRef} from 'react';
import allCoords from "../utils/coords";

const apiKey = 'AIzaSyBkb8vHV8n4gu8QQrYeb6cy3MtRwS3IA9o';

export function Input(props) {
    const [address, setAddress] = useState("");
    const [inBounds, setInBounds] = useState(null);

    const geocoder = useRef(null);
    const cityBounds = useRef([]);

    function buildCityBounds() {
        for (let i = 0; i < allCoords.length; i++) {
            let color;
            if (allCoords[i].day === "Monday") {
                color = "green";
            }
            if (allCoords[i].day === "Tuesday") {
                color = "purple";
            }
            if (allCoords[i].day === "Wednesday") {
                color = "orange";
            }
            if (allCoords[i].day === "Thursday") {
                color = "blue";
            }
            if (allCoords[i].day === "Friday") {
                color = "red";
            }
            const section = new window.google.maps.Polygon({
                paths: allCoords[i].source,
                strokeColor: color,
                fillColor: color,
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillOpacity: 0.35
            });

            // section.setMap(map); // for display map
            cityBounds.current.push(
                {
                    section: section,
                    day: allCoords[i].day
                }
            );
        }
    }

    function inCityBoundaries(location) {
        let inCity, pickUpDay;
        for (let i = 0; i < cityBounds.current.length; i++) {
            if (window.google.maps.geometry.poly.containsLocation(location.geometry.location, cityBounds.current[i].section)) {
                // determines pick up day
                pickUpDay = cityBounds.current[i].day;
                inCity = true;
                break;
            }
            else {
                inCity = false;
            }
        }
        if (inCity) {
            setInBounds(true);
            props.setPickupDay((pickUpDay))
            props.setShowForm(true);
            // document.getElementById('addressDisplay').value = `${location.address_components[0].long_name} ${location.address_components[1].long_name}`;
        }
        else {
            setInBounds(false);
        }
    }

    function geocodeAddress() {
        geocoder.current.geocode({'address': document.getElementById('signupInput').value}, function (results, status) {
            if (status === 'OK') {
                // IF address is legitimate, run inCityBoundaries and pass location
                inCityBoundaries(results[0]);
            } else {
                // ELSE alert
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    }

    useEffect(() => {
        window.mapLoaded = function() {
            geocoder.current = new window.google.maps.Geocoder();

            var defaultBounds = new window.google.maps.LatLngBounds(
                new window.google.maps.LatLng(37.277730, -107.880110)
            );

            new window.google.maps.places.Autocomplete(document.getElementById('signupInput'),
                {bounds: defaultBounds}
            );

            buildCityBounds();
        }

        const script = document.createElement('script');
        script.src = `//maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=mapLoaded`;
        script.async = true;
        document.body.append(script);

    }, []);

    return <div>
        {inBounds === false && <div>
            That address isn't in the city!
        </div>}
        <input autoFocus='true' placeholder='Enter your physical address' className="form-control mt-lg-5"
               id='signupInput'/>
        <div className="input-group-append my-2">
            <button onClick={geocodeAddress} className='btn btn-primary font-weight-bold m-auto'
                    id='signupButton' target="_blank">SIGN UP
                FOR SERVICE
            </button>
        </div>
    </div>
}
