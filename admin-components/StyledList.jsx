
import { Box, Table, TableRow, TableCell, Badge, Text } from '@adminjs/design-system';

const StyledList = (props) => {
  const { records, resource } = props;
  return (
    <Box variant="grey">
      <Table>
        <thead>
          <TableRow>
            {resource.decorate().getListProperties().map((property) => (
              <TableCell key={property.name()}><Text fontWeight="bold">{property.label()}</Text></TableCell>
            ))}
          </TableRow>
        </thead>
        <tbody>
          {records.map((record) => (
            <TableRow key={record.id}>
              {resource.decorate().getListProperties().map((property) => (
                <TableCell key={property.name()}>
                  {property.name() === 'status' ? (
                    <Badge variant={record.params.status === 'active' ? 'success' : 'danger'}>{record.params.status}</Badge>
                  ) : (
                    <Text>{record.params[property.name()]}</Text>
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </tbody>
      </Table>
    </Box>
  );
};

export default StyledList;
