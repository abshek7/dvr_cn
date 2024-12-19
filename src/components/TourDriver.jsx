import { useEffect, useRef, useState } from 'react';
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const TourDriver = ({ isOpen, onClose }) => {
  const driverRef = useRef(null);
  const [isTourActive, setIsTourActive] = useState(false);

  useEffect(() => {
    driverRef.current = driver({
      showProgress: true,
      steps: [
        { 
          element: '#example-input', 
          popover: { 
            title: 'Sample input', 
            description: 'Sample input : As of now for less number of nodes.',
            side: "bottom",
            align: "start"
          }
        },
        
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
            description: 'This visualizes the network. Click on a node to see its routing table,be carefull sure tour will begin from start.',
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
        { popover: { title: 'Happy Coding', description: 'And that is all, go ahead and experience innovation.' } }
      ],
    
      onDestroyStarted: () => {
        setIsTourActive(false);
        onClose();
      },
    });

    return () => {
      if (driverRef.current) {
        driverRef.current.destroy();
      }
    };
  }, [onClose]);

  useEffect(() => {
    if (isOpen && !isTourActive) {
      setIsTourActive(true);
      driverRef.current.drive();
    } else if (!isOpen && isTourActive) {
      driverRef.current.destroy();
      setIsTourActive(false);
    }
  }, [isOpen, isTourActive]);

  return null;
};

export default TourDriver;

