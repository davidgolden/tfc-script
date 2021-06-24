import {useState} from 'react';
import {SignupForm} from "./components/signup";
import {Input} from "./components/input";

function App() {
    const [showForm, setShowForm] = useState(false);
    const [pickupDay, setPickupDay] = useState("");

    return (
        <div className="App">
            {showForm ? <SignupForm pickupDay={pickupDay} setShowForm={setShowForm}/> : <Input setShowForm={setShowForm} setPickupDay={setPickupDay} />}
        </div>
    );
}

export default App;
