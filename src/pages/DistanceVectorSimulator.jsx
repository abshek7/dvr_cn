import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Accordion,AccordionContent,AccordionItem,AccordionTrigger} from "@/components/ui/accordion";
import NetworkGraph from "@/components/NetworkGraph";
import RoutingTable from "@/components/RoutingTable";
import SimulationControls from "@/components/SimulationControls";
import TourDriver from "@/components/TourDriver";
import avatarImage from "@/assets/avatar.png";

const DistanceVectorSimulator = () => {
  { /*state for node and edges related to graph*/}
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  {   /*state for routing tables*/}
  const [routingTables, setRoutingTables] = useState({});

  {   /*state for control media*/}
  const [isPlaying, setIsPlaying] = useState(false);
  const [iteration, setIteration] = useState(0);
  
  { /*state for selection and showing node information*/}
  const [selectedNode, setSelectedNode] = useState(null);

  {  /*state for form based input data*/}
  const [formData, setFormData] = useState({
    nodeId: "",
    edgeFrom: "",
    edgeTo: "",
    edgeCost: "",
  });

  {  /*state for tour using driver.js*/}
  const [isTourOpen, setIsTourOpen] = useState(false);
  
  const toggleTour = () => {
    setIsTourOpen(prevState => !prevState);
  };


  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addNode = (e) => {
    e.preventDefault();
  
    const nodeId = formData.nodeId.trim();
    if (!nodeId || nodeId.length !== 1 || !/^[A-Z]$/.test(nodeId)) {
      toast({
        title: "Error",
        description: "Node ID must be a single alphabetic character (A-Z)",
        variant: "destructive",
      });
      return;
    }
  
    if (nodes.find((n) => n.id === nodeId)) {
      toast({
        title: "Error",
        description: "Node ID already exists",
        variant: "destructive",
      });
      return;
    }
  


    const angle = (nodes.length * (2 * Math.PI)) / (nodes.length + 1);
    const newNode = {
      id: nodeId,
      x: 200 + 150 * Math.cos(angle),
      y: 200 + 150 * Math.sin(angle),
    };

    setNodes((prev) => [...prev, newNode]);
    setRoutingTables((prev) => ({
      ...prev,
      [nodeId]: [...nodes, newNode].map((n) => ({
        destination: n.id,
        nextHop: n.id === nodeId ? "-" : "?",
        cost: n.id === nodeId ? 0 : Infinity,
      })),
    }));
    updateFormData("nodeId", "");
  };

  const addEdge = (e) => {
    e.preventDefault();
    const { edgeFrom, edgeTo, edgeCost } = formData;
    const cost = parseInt(edgeCost);

    if (!edgeFrom || !edgeTo || !edgeCost) {
      toast({
        title: "Error",
        description: "Please fill all edge details",
        variant: "destructive",
      });
      return;
    }

    if (
      isNaN(cost) ||
      cost <= 0 ||
      edgeFrom === edgeTo ||
      !nodes.find((n) => n.id === edgeFrom) ||
      !nodes.find((n) => n.id === edgeTo) ||
      edges.find(
        (e) =>
          (e.from === edgeFrom && e.to === edgeTo) ||
          (e.from === edgeTo && e.to === edgeFrom)
      )
    ) {
      toast({
        title: "Error",
        description: "Invalid edge configuration",
        variant: "destructive",
      });
      return;
    }

    setEdges((prev) => [...prev, { from: edgeFrom, to: edgeTo, cost }]);
    setRoutingTables((prev) => {
      const updated = { ...prev };
      [edgeFrom, edgeTo].forEach((node) => {
        const otherNode = node === edgeFrom ? edgeTo : edgeFrom;
        updated[node] = updated[node].map((entry) =>
          entry.destination === otherNode
            ? { ...entry, nextHop: otherNode, cost }
            : entry
        );
      });
      return updated;
    });

    setFormData((prev) => ({
      ...prev,
      edgeFrom: "",
      edgeTo: "",
      edgeCost: "",
    }));
  };

  const performDistanceVectorStep = () => {
    let updated = false;
    setRoutingTables((prev) => {
      const newTables = { ...prev };
      Object.keys(prev).forEach((currentNode) => {
        Object.keys(prev).forEach((destination) => {
          edges
            .filter(
              (edge) => edge.from === currentNode || edge.to === currentNode
            )
            .forEach((edge) => {
              const neighbour = edge.from === currentNode ? edge.to : edge.from;
              const currentRoute = newTables[currentNode].find(
                (entry) => entry.destination === destination
              );
              const neighbourRoute = prev[neighbour].find(
                (entry) => entry.destination === destination
              );

              if (currentRoute && neighbourRoute) {
                const newCost = edge.cost + neighbourRoute.cost;
                if (newCost < currentRoute.cost) {
                  currentRoute.cost = newCost;
                  currentRoute.nextHop = neighbour;
                  updated = true;
                }
              }
            });
        });
      });
      return newTables;
    });

    if (updated) {
      toast({
        title: "Tables Updated",
        description: `Iteration ${iteration + 1}: Found better routes!`,
      });
    } else {
      toast({
        title: "Convergence Reached",
        description: "No better routes found - algorithm has converged!",
      });
      setIsPlaying(false);
    }

    setIteration((prev) => prev + 1);
    return updated;
  };

  useEffect(() => {
    let intervalId;
    if (isPlaying) {
      intervalId = setInterval(() => {
        const updated = performDistanceVectorStep();
        if (!updated) setIsPlaying(false);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isPlaying]);

  const handleReset = () => {
    setIsPlaying(false);
    const initialTables = Object.fromEntries(
      nodes.map((node) => [
        node.id,
        nodes.map((n) => ({
          destination: n.id,
          nextHop: n.id === node.id ? "-" : "?",
          cost: n.id === node.id ? 0 : Infinity,
        })),
      ])
    );

    edges.forEach(({ from, to, cost }) => {
      [from, to].forEach((node) => {
        const otherNode = node === from ? to : from;
        initialTables[node] = initialTables[node].map((entry) =>
          entry.destination === otherNode
            ? { ...entry, nextHop: otherNode, cost }
            : entry
        );
      });
    });

    setRoutingTables(initialTables);
    setIteration(0);
    toast({
      title: "Simulation Reset",
      description: "All routing tables have been reset to initial state.",
    });
  };


  const endTour = () => {
    setIsTourOpen(false);
  };



  return (
    <div className="container mx-auto p-4 space-y-4">
      <TourDriver isOpen={isTourOpen} onClose={endTour} />
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
          <AvatarImage src={avatarImage} alt="DVR" />

            <AvatarFallback>DVR</AvatarFallback>
          </Avatar>
          <h1 className="text-3xl font">DVR Simulator</h1>
        </div>
        <TourDriver isOpen={isTourOpen} onClose={endTour} />
      <Button onClick={toggleTour}>
        {isTourOpen ? 'End Tour' : 'Start Tour'}
      </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <Accordion type="single" collapsible className="mb-4" id="example-input">
            <AccordionItem value="example" >
              <AccordionTrigger ><b>Example Input:</b></AccordionTrigger>
              <AccordionContent >
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg" >
                    <h3 className="font-semibold mb-2">
                      Sample input : As of now for less number of nodes
                    </h3>
                    <pre className="whitespace-pre-wrap text-sm" >
                      Pairwise Distances for A: {"{"}'A': 0, 'B': 1, 'C': 4{"}"}
                      <br />
                      Pairwise Distances for B: {"{"}'A': 1, 'B': 0, 'C': 2,
                      'D': 6{"}"} <br />
                      Pairwise Distances for C: {"{"}'A': 4, 'B': 2, 'C': 0,
                      'D': 3{"}"} <br />
                      Pairwise Distances for D: {"{"} 'B': 6, 'C': 3{"}"} <br />
                    </pre>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Card className="p-4" id="add-node">
            <h2 className="text-xl font-semibold mb-4">Add Node</h2>
            <form onSubmit={addNode} className="flex gap-2">
              <Input
                placeholder="Node ID (A-Z)"
                value={formData.nodeId}
                onChange={(e) => {
                  const value = e.target.value
                    .toUpperCase()
                    .replace(/[^A-Z]/g, "");
                  if (value.length <= 1) {
                    updateFormData("nodeId", value);
                  }
                }}
              />
              <Button type="submit">Add Node</Button>
            </form>
          </Card>

          <Card className="p-4" id="add-edge">
            <h2 className="text-xl font-semibold mb-4">Add Edge</h2>
            <form onSubmit={addEdge} className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="From Node"
                  value={formData.edgeFrom}
                  onChange={(e) => {
                    const value = e.target.value
                      .toUpperCase()
                      .replace(/[^A-Z]/g, "");
                    updateFormData("edgeFrom", value);
                  }}
                />
                <Input
                  placeholder="To Node"
                  value={formData.edgeTo}
                  onChange={(e) => {
                    const value = e.target.value
                      .toUpperCase()
                      .replace(/[^A-Z]/g, "");
                    updateFormData("edgeTo", value);
                  }}
                />
                <Input
                  placeholder="Cost"
                  type="number"
                  value={formData.edgeCost}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (!isNaN(value) && value > 0) {
                      updateFormData("edgeCost", value);
                    }
                  }}
                />
              </div>
              <Button type="submit" className="w-full">
                Add Edge
              </Button>
            </form>
          </Card>

          <div id="network-graph">
            <NetworkGraph
              nodes={nodes}
              edges={edges}
              selectedNode={selectedNode}
              onNodeClick={setSelectedNode}
            />
          </div>
          <div id="simulation-controls">
            <SimulationControls
              isPlaying={isPlaying}
              onPlayPause={() => setIsPlaying(!isPlaying)}
              onReset={handleReset}
              onStep={performDistanceVectorStep}
            />
          </div>
        </div>

        <div className="space-y-4" id="routing-tables">
          {selectedNode ? (
            <RoutingTable
              key={selectedNode}
              nodeId={selectedNode}
              entries={routingTables[selectedNode]}
              className="border-2 border-primary"
            />
          ) : (
            Object.entries(routingTables).map(([nodeId, entries]) => (
              <RoutingTable key={nodeId} nodeId={nodeId} entries={entries} />
            ))
          )}
          {selectedNode && (
            <Button onClick={() => setSelectedNode(null)} className="w-full">
              Show All Tables
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DistanceVectorSimulator;

