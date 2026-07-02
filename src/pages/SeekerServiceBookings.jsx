import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { bookingService } from "../services/bookingService";

export default function SeekerServiceBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("userType");

    if (!token || userType !== "seeker") {
      navigate("/login");
      return;
    }

    const loadBookings = async () => {
      try {
        const data = await bookingService.getMyBookings({ limit: 50 });
        setBookings((data.bookings || []).filter((booking) => booking.serviceName));
      } catch (error) {
        setError(error.message || "Failed to load service bookings");
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [navigate]);

  const getStatusLabel = (booking) => {
    if (booking.paymentStatus === "pending") return "Payment Pending";
    return bookingService.getStatusLabel(booking.status);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">My Service Bookings</h1>
            <p className="text-muted-foreground">Track service bookings made from consultant profile pages.</p>
          </div>

          {loading && <p className="text-muted-foreground">Loading your service bookings...</p>}
          {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">{error}</div>}

          {!loading && bookings.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground mb-4">You have not made any service bookings yet.</p>
                <Button onClick={() => navigate("/consultants")}>Find Consultants</Button>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking._id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <CardTitle>{booking.serviceName}</CardTitle>
                    <Badge>{getStatusLabel(booking)}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Consultant: {booking.consultant?.fullName || "Consultant"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Date: {bookingService.formatBookingDate(booking.sessionDate)} at {booking.startTime}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Amount: {bookingService.formatCurrency(booking.amount)} · Payment: {booking.paymentStatus}
                  </p>
                  {booking.paymentStatus === "pending" ? (
                    <Button onClick={() => navigate(`/booking-confirmation/${booking._id}`)}>
                      Pay Now
                    </Button>
                  ) : (
                    <Button variant="outline" onClick={() => navigate(`/booking-confirmation/${booking._id}`)}>
                      View Details
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
