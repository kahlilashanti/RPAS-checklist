import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Toast, ToastContainer } from 'react-bootstrap';

export default function RPASChecklist() {
    const [pilotName, setPilotName] = useState('');
    const [date, setDate] = useState('');
    const [completed, setCompleted] = useState({});
    const [showToast, setShowToast] = useState(false);
    const [showInstallPrompt, setShowInstallPrompt] = useState(false);
    const [showInstallSuccess, setShowInstallSuccess] = useState(false);

    const normalProcedures = [
        'Pre-flight inspection of RPAS (airframe, motors, propellers, payload)',
        'Battery fully charged and securely installed',
        'Control link established (RC to RPAS)',
        'Check GPS status and satellite lock',
        'Check NOTAMs and airspace restrictions',
        'Conduct site survey',
        'Confirm emergency procedures',
        'Perform compass calibration if required',
        'Verify weather conditions (visibility, wind, etc.)',
        'Takeoff clearance (if in controlled airspace)',
        'Takeoff and hover at safe altitude to verify control responsiveness'
    ];

    const emergencyProcedures = [
        'Loss of command and control link - initiate RTH or manual recovery',
        'Loss of GPS - maintain manual control and land safely',
        'Battery warning/low battery - return and land immediately',
        'Flyaway - attempt RTH, or terminate flight if safe',
        'Unexpected obstacle - execute evasive maneuver and land',
        'Weather deterioration - terminate flight and land safely'
    ];

    const siteSurvey = [
        'Identify airspace classification for flight area',
        'Check for NOTAMs and restricted airspace nearby',
        'Assess terrain (hills, buildings, trees, powerlines)',
        'Identify emergency access points',
        'Verify proximity to aerodromes, helipads, or built-up areas',
        'Evaluate potential hazards (people, vehicles, animals)',
        'Confirm weather forecast is suitable for flight',
        'Ensure bystander safety and establish buffer zones'
    ];

    useEffect(() => {
        localStorage.setItem('rpasChecklist', JSON.stringify({ pilotName, date, completed }));
        if (Object.keys(completed).length > 0) {
            setShowToast(true);
        }
    }, [pilotName, date, completed]);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('rpasChecklist')) || {};
        setPilotName(saved.pilotName || '');
        setDate(saved.date || '');
        setCompleted(saved.completed || {});
    }, []);

    useEffect(() => {
        let deferredPrompt;
        const handler = (e) => {
            e.preventDefault();
            deferredPrompt = e;
            window.deferredPrompt = deferredPrompt;
            setShowInstallPrompt(true);
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleCheck = (category, index) => {
        const key = `${category}-${index}`;
        setCompleted(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleReset = () => {
        setCompleted({});
        setDate('');
        setPilotName('');
        localStorage.removeItem('rpasChecklist');
    };

    const triggerInstall = () => {
        if (window.deferredPrompt) {
            window.deferredPrompt.prompt();
            window.deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    setShowInstallSuccess(true);
                }
                setShowInstallPrompt(false);
            });
        }
    };

    return (
        <div className="container my-5">
            <h1 className="mb-4">RPAS Flight Checklist - DJI Mini 4 Pro</h1>

            {showInstallPrompt && (
                <div className="alert alert-info d-flex justify-content-between align-items-center">
                    <span>Add this app to your home screen?</span>
                    <button className="btn btn-primary btn-sm" onClick={triggerInstall}>Install</button>
                </div>
            )}

            <div className="mb-3 row">
                <div className="col-md-6">
                    <label className="form-label">Pilot Name</label>
                    <input type="text" className="form-control" value={pilotName} onChange={e => setPilotName(e.target.value)} />
                </div>
                <div className="col-md-6">
                    <label className="form-label">Date</label>
                    <input type="date" className="form-control" value={date} onChange={e => setDate(e.target.value)} />
                </div>
            </div>

            <h3 className="mt-4">Normal Procedures</h3>
            <ul className="list-group mb-4">
                {normalProcedures.map((item, idx) => (
                    <li key={idx} className="list-group-item">
                        <input type="checkbox" className="form-check-input me-2" checked={completed[`normal-${idx}`] || false} onChange={() => handleCheck('normal', idx)} />
                        {item}
                    </li>
                ))}
            </ul>

            <h3>Emergency Procedures</h3>
            <ul className="list-group mb-4">
                {emergencyProcedures.map((item, idx) => (
                    <li key={idx} className="list-group-item">
                        <input type="checkbox" className="form-check-input me-2" checked={completed[`emergency-${idx}`] || false} onChange={() => handleCheck('emergency', idx)} />
                        {item}
                    </li>
                ))}
            </ul>

            <h3>Site Survey</h3>
            <ul className="list-group mb-4">
                {siteSurvey.map((item, idx) => (
                    <li key={idx} className="list-group-item">
                        <input type="checkbox" className="form-check-input me-2" checked={completed[`site-${idx}`] || false} onChange={() => handleCheck('site', idx)} />
                        {item}
                    </li>
                ))}
            </ul>

            <button className="btn btn-success" onClick={handleReset}>Reset Checklist</button>

            <ToastContainer position="bottom-end" className="p-3">
                <Toast onClose={() => setShowToast(false)} show={showToast} delay={2000} autohide bg="success">
                    <Toast.Body className="text-white">Checklist progress saved!</Toast.Body>
                </Toast>

                <Toast onClose={() => setShowInstallSuccess(false)} show={showInstallSuccess} delay={3000} autohide bg="primary">
                    <Toast.Body className="text-white">App installed to home screen!</Toast.Body>
                </Toast>
            </ToastContainer>
        </div>
    );
}
