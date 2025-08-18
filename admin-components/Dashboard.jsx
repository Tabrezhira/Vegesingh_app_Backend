import React from 'react'
import { Box, H2, Text, Table, TableRow, TableCell, Badge, ValueBlock, Label } from '@adminjs/design-system'

const StatCard = ({ label, value, accent }) => (
  <ValueBlock label={label} value={value} style={{ minWidth: 140 }} />
)

const Dashboard = (props) => {
  const { data } = props
  const stats = data?.stats || {}
  const today = data?.today || {}
  const statusCounts = data?.statusCounts || {}
  const trend = data?.ordersLast7 || []
  const popular = data?.popularProducts || []
  const orders = data?.recentOrders || []

  return (
    <Box variant="grey" p="xl">
      <H2>Vegesingh Overview</H2>
      <Text mt="md" mb="xl" fontSize={14} color="grey60">Generated: {new Date(data?.generatedAt || Date.now()).toLocaleString()}</Text>

      <Box display="flex" flexWrap="wrap" gap="lg" mb="xl">
        <StatCard label="Users" value={stats.userCount} />
        <StatCard label="Products" value={stats.productCount} />
        <StatCard label="Orders" value={stats.orderCount} />
        <StatCard label="Revenue" value={`₹${stats.revenue}`} />
        <StatCard label="New Users (Today)" value={today.usersToday} />
        <StatCard label="Orders (Today)" value={today.ordersToday} />
        <StatCard label="Revenue (Today)" value={`₹${today.revenueToday}`} />
      </Box>

      <Box mb="xl" display="flex" flexWrap="wrap" gap="xxl">
        <Box flexBasis="260px" flexGrow={1}>
          <H2 fontSize={18} mb="md">Order Status</H2>
          <Table>
            <tbody>
              {['pending','processing','shipped','delivered','cancelled'].map(st => (
                <TableRow key={st}>
                  <TableCell>{st}</TableCell>
                  <TableCell><Badge variant={st==='delivered' ? 'success' : st==='cancelled' ? 'danger' : 'info'}>{statusCounts[st] || 0}</Badge></TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </Box>
        <Box flexGrow={2} minWidth="400px">
          <H2 fontSize={18} mb="md">Last 7 Days</H2>
          <Table>
            <thead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Orders</TableCell>
                <TableCell>Revenue</TableCell>
              </TableRow>
            </thead>
            <tbody>
              {trend.map(d => (
                <TableRow key={d.date}>
                  <TableCell>{d.date}</TableCell>
                  <TableCell>{d.orders}</TableCell>
                  <TableCell>₹{d.revenue}</TableCell>
                </TableRow>
              ))}
              {!trend.length && <TableRow><TableCell colSpan={3}><Text color="grey60">No recent data.</Text></TableCell></TableRow>}
            </tbody>
          </Table>
        </Box>
      </Box>

      <Box display="flex" flexWrap="wrap" gap="xxl">
        <Box flexGrow={1} flexBasis="480px">
          <H2 fontSize={20} mb="md">Popular Products</H2>
          <Table>
            <thead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Price</TableCell>
              </TableRow>
            </thead>
            <tbody>
              {popular.map(p => (
                <TableRow key={p._id}>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>₹{p.price}</TableCell>
                </TableRow>
              ))}
              {!popular.length && (
                <TableRow><TableCell colSpan={2}><Text color="grey60">No popular products yet.</Text></TableCell></TableRow>
              )}
            </tbody>
          </Table>
        </Box>

        <Box flexGrow={1} flexBasis="480px">
          <H2 fontSize={20} mb="md">Recent Orders</H2>
          <Table>
            <thead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
              </TableRow>
            </thead>
            <tbody>
              {orders.map(o => (
                <TableRow key={o._id}>
                  <TableCell>{o.orderId}</TableCell>
                  <TableCell>₹{o.total}</TableCell>
                  <TableCell><Badge variant={o.status === 'delivered' ? 'success' : 'info'}>{o.status}</Badge></TableCell>
                  <TableCell>{new Date(o.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
              {!orders.length && (
                <TableRow><TableCell colSpan={4}><Text color="grey60">No orders yet.</Text></TableCell></TableRow>
              )}
            </tbody>
          </Table>
        </Box>
      </Box>
    </Box>
  )
}

export default Dashboard
