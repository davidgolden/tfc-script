import {useState, useEffect} from 'react';

const stripe = window.Stripe(process.env.NODE_ENV === 'production' ? 'pk_live_FNdBQ3OEOBjGbMJNkydfBXvR' : 'pk_test_TjyZC203Z1UFc6PXrRVhIxl1');

export function SignupForm(props) {
    const [appt, setAppt] = useState(false);
    const [billingSame, setBillingSame] = useState(false);

    function stripeSourceHandler(source) {
        // Insert the source ID into the form so it gets submitted to the server
        const hiddenInput = document.createElement('input');
        hiddenInput.setAttribute('type', 'hidden');
        hiddenInput.setAttribute('name', 'stripeSource');
        hiddenInput.setAttribute('value', source.id);
        this.paymentForm.appendChild(hiddenInput);

        const pickupDay = document.getElementById('pickupDayText').innerHTML;
        const pickupDayInput = document.createElement('input');
        pickupDayInput.setAttribute('type', 'hidden');
        pickupDayInput.setAttribute('name', 'pickupDay');
        pickupDayInput.setAttribute('value', pickupDay);
        this.paymentForm.appendChild(pickupDayInput);

        // Submit the paymentForm
    }

    // const checkForm = form => {
    //     if (form.password.value !== form.confirm.value) {
    //         alert('Passwords do not match!');
    //         return false;
    //     } else if (
    //         !form.terms.checked
    //     ) {
    //         alert('Please indicate that you accept the Terms and Conditions!');
    //         return false;
    //     }
    //     return true;
    // };

    function handleSubmit() {
        document.getElementById('btnSubmit').classList.add('disabled');

        let ownerInfo;
        if (!billingSame) {
            ownerInfo = {
                owner: {
                    name: this.paymentForm.billingName.value,
                    address: {
                        line1: this.paymentForm.billingAddress.value,
                        city: this.paymentForm.billingCity.value,
                        state: this.paymentForm.billingState.value,
                        postal_code: this.paymentForm.billingZipcode.value,
                        country: 'US',
                    },
                    email: this.paymentForm.email.value
                },
            };
        } else {
            ownerInfo = {
                owner: {
                    name: `${this.paymentForm.first_name.value} ${this.paymentForm.last_name.value}`,
                    address: {
                        line1: this.paymentForm.addressDisplay.value,
                        line2: this.paymentForm.apartment.value,
                        city: this.paymentForm.city.value,
                        state: this.paymentForm.state.value,
                        postal_code: this.paymentForm.zipcode.value,
                        country: 'US',
                    },
                    email: this.paymentForm.email.value
                },
            };
        }

        stripe.createSource(this.registerCard, ownerInfo).then(result => {
            if (result.error) {
                // Inform the user if there was an error
                const errorElement = document.getElementById('card-errors');
                errorElement.textContent = result.error.message;
                return document.getElementById('btnSubmit').classList.remove('disabled');
            } else {
                // Send the source to your server
                let source = result.source;
                // this is weird.. but sometimes an array is returned which errors out
                if (Array.isArray(source)) {
                    source = source[0];
                }
                stripeSourceHandler(source);
            }
        });
    }

    useEffect(() => {
        const registerElement = stripe.elements();

        // Custom styling can be passed to options when creating an Element.
        const style = {
            base: {
                // Add your base input styles here. For example:
                fontSize: '16px',
                color: "#32325d",
            },
        };

        // Create an instance of the card Element
        const registerCard = registerElement.create('card', {style: style, hidePostalCode: true});

        registerCard.mount('#register-card-element');

        registerCard.addEventListener('change', event => {
            let displayError = document.getElementById('card-errors');
            if (event.error) {
                displayError.textContent = event.error.message;
            } else {
                displayError.textContent = '';
            }
        });
    }, []);

    return <div id='signupModal'>
        <div className="modal-header">
            <h5 className="modal-title">Sign Up for Curbside Composting!</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => props.setShowForm(false)}>
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div className="modal-body" id='accountInfo'>
            <h2 className='text-center'>Your pick up day is
                <span id='pickupDayText' className='badge badge-secondary'
                      style={{backgroundColor: '#F16521'}}>{props.pickupDay}</span>
            </h2>
            <hr/>
            <form action='/' method='post' id='payment-form'>
                <div className='row'>
                    <div className='col-md-6'>
                        <h3>Account Information</h3>
                        <div className='form-group half-form-container'>
                            <input type='text' placeholder='First Name' className='form-control'
                                   id='first_name'
                                   name='customer[first_name]' required/>
                            <input type='text' placeholder='Last Name' className='form-control'
                                   id='last_name'
                                   name='customer[last_name]' required/>
                        </div>
                        <div className='form-group'>
                            <input autoComplete='email' type='email' placeholder='Email'
                                   className='form-control' id='email' name='customer[email]' required/>
                        </div>
                        <div className='form-group'>
                            <input autoComplete='tel' type='tel' placeholder='Telephone Number'
                                   className='form-control' id='phone' name='customer[phone]'
                                   required/>
                        </div>
                        <div className='form-group'>
                            <input type='password' id='password' placeholder='Password'
                                   className='form-control'
                                   name='customer[password]' required minLength='8'/>
                            <small>Minimum password length is 8 characters.</small>
                        </div>
                        <div className='form-group'>
                            <input type='password' id='confirm' placeholder='Confirm Password'
                                   className='form-control' name='customer[confirm]' required
                                   minLength='8'/>
                        </div>

                        <div id='housing' className="btn-group" data-toggle="buttons" role='group'>
                            <label className="btn btn-success active">
                                <input onChange={() => setAppt(false)} checked={!appt} type="radio" name="housing" id="house" autoComplete="off"/>
                                House
                            </label>
                            <label className="btn btn-success">
                                <input onChange={() => setAppt(true)} checked={appt} id='appt' type="radio" name="housing" autoComplete="off"/> Apartment
                            </label>
                        </div>


                        <div className='form-group'>
                            <input type='text' placeholder='Street Address' name='customer[address]'
                                   id='addressDisplay' className='form-control' required/>
                        </div>

                        {appt && <div className='form-group'>
                            <input type='text' placeholder='Apartment #' id='apartment'
                                   name='customer[appt]' className='form-control'/>
                        </div>}

                        <div className='form-group'>
                            <input type='text' placeholder='City' id='city' className='form-control'
                                   name='customer[city]' value='Durango' required/>
                        </div>

                        <div className='half-form-container'>
                            <input type='text' placeholder='State' id='state' className='form-control'
                                   name='customer[state]' value='CO' required/>
                            <input type='text' placeholder='Zipcode' id='zipcode' className='form-control'
                                   name='customer[zip]' value='81301' required/>
                        </div>

                        <div className='form-group'>
                            <input type='text' placeholder='How did you hear about us?'
                                   name='customer[referral]' className='form-control' required/>
                        </div>

                    </div>

                    <div className='col-md-6'>
                        <h3>Payment Information</h3>

                        <div className='form-group'>
                            <label>Select Payment Plan</label>
                            <select className='form-control' name='customer[plan]'>
                                <option value='monthly-compost'>Monthly Compost Only ($25/mo)</option>
                                <option value='monthly-glass'>Monthly Glass Only ($18)</option>
                                <option value='monthly-compost-glass'>Monthly Compost/Glass ($34)</option>
                                <option value='one-time-compost'>6-Months Compost Only ($150)</option>
                                <option value='one-time-compost-glass'>6-Months Compost/Glass ($204)
                                </option>
                                <option value='business-cafe'>BUSINESS Cafe ($89/mo)</option>
                                <option value='business-small'>BUSINESS Small ($149/mo)</option>
                                <option value='business-large'>BUSINESS Large ($199/mo)</option>
                                <option value='monthly-invoice'>BUSINESS Monthly Pickup ($29/mo)</option>
                            </select>
                            <small>All plans include a one-time set-up fee of $18 for residential or $45 for
                                commercial.
                                <a tabIndex="0" className="btn btn-sm btn-primary popover-info"
                                   role="button"
                                   data-toggle="popover" data-trigger="focus"
                                   data-content="This goes into a collective pool to cover the costs of damaged or stolen buckets.">?</a>
                            </small>
                        </div>

                        <div className='form-check'>
                            <label className="form-check-label" id='billing' style={{textAlign: 'left'}}>
                                <input onChange={() => setBillingSame(v => !v)} id='billing' className="form-check-input" type="checkbox" value={billingSame} />
                                Billing address is different from pick up address.
                            </label>
                        </div>

                        {billingSame && <div>
                            <div className='form-group'>
                                <input type='text' placeholder='Billing Name' id='billingName'
                                       className='form-control'/>
                            </div>
                            <div className='form-group'>
                                <input type='text' placeholder='Billing Street Address' id='billingAddress'
                                       className='form-control'/>
                            </div>
                            <div className='form-group'>
                                <input type='text' placeholder='Billing City' id='billingCity'
                                       className='form-control'/>
                            </div>
                            <div className='half-form-container'>
                                <input type='text' placeholder='Billing State' id='billingState'
                                       className='form-control'/>
                                <input type='text' placeholder='Billing Zipcode' id='billingZipcode'
                                       className='form-control'/>
                            </div>
                        </div>}

                        <div className="form-group">
                            <label htmlFor="register-card-element">
                                Credit or debit card
                            </label>
                            <div id="register-card-element" className='form-control' />
                            <div id="card-errors" role="alert"/>
                        </div>

                        <div className='form-group' style={{width: '50%'}}>
                            <input type='text' className='form-control' name='customer[coupon]'
                                   placeholder='Discount Code'/>
                        </div>

                        <div className="form-check form-check-inline">
                            <label className="form-check-label">
                                <input className="form-check-input" type="checkbox" id="terms" value="terms"
                                       required/> I agree to the
                                <a href='https://docs.google.com/document/d/1bijvC0KepRZNmxt4yiHQoXOZHfnMMZGK4zfUAkTZNbY/preview'
                                   target='_blank'>Terms and
                                    Conditions</a>.
                            </label>
                        </div>

                        <div className="g-recaptcha" data-sitekey="6LeHohYTAAAAAAI82zsmMRtt4b6QGWQTpihHZ_5a"
                             data-callback="onRecaptchaResponse"/>
                        <button type="submit" id='btnSubmit' className="btn btn-primary disabled">Submit
                            Payment and
                            Subscribe!
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
}
