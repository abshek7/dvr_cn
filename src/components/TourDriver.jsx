import { useEffect, useRef } from 'react';
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const TourDriver = ({ isOpen, onClose }) => {
  const driverRef = useRef(null);

  useEffect(() => {
    driverRef.current = driver({
      showProgress: true,
      steps: [
        { 
          element: '#add-node', 
          popover: { 
            title: 'Add Node', 
            description: 'Enter a single letter (A-Z) to add a new node to the network.',
            side: "bottom",
            align: "start"
          }
        },
        { 
          element: '#add-edge', 
          popover: { 
            title: 'Add Edge', 
            description: 'Specify two nodes and a cost to add an edge between them.',
            side: "bottom",
            align: "start"
          }
        },
        { 
          element: '#network-graph', 
          popover: { 
            title: 'Network Graph', 
            description: 'This visualizes the network. Click on a node to see its routing table.',
            side: "left",
            align: "start"
          }
        },
        { 
          element: '#simulation-controls', 
          popover: { 
            title: 'Simulation Controls', 
            description: 'Use these buttons to control the simulation: play/pause, step, and reset.',
            side: "top",
            align: "start"
          }
        },
        { 
          element: '#routing-tables', 
          popover: { 
            title: 'Routing Tables', 
            description: 'These tables show the current routing information for each node.',
            side: "left",
            align: "start"
          }
        },
      ],
      onReset: onClose,
    });

    return () => {
      if (driverRef.current) {
        driverRef.current.destroy();
      }
    };
  }, [onClose]);

  useEffect(() => {
    if (isOpen && driverRef.current) {
      driverRef.current.drive();
    }
  }, [isOpen]);

  return null;
};

export default TourDriver;

