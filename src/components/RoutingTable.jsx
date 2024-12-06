import { Card } from "@/components/ui/card";
import {Table,TableBody,TableCell,TableHead, TableHeader, TableRow,} from "@/components/ui/table";

const RoutingTable = ({ nodeId, entries }) => {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-bold mb-2">Router {nodeId}</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Destination</TableHead>
            <TableHead>Next Hop</TableHead>
            <TableHead>Cost</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.destination}>
              <TableCell>{entry.destination}</TableCell>
              <TableCell>{entry.nextHop}</TableCell>
              <TableCell>{entry.cost}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default RoutingTable;

