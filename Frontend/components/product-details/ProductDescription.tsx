"use client";

import { FC, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./ProductDetails.module.scss";
import { CircleUserRound, ShoppingCart } from "lucide-react";

const ProductDescription: FC<
  | {
      title: string;
      text: string;
      id: number;
      img: string;
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | any
> = ({ title, text, id }) => {
  const [showModal, setShowModal] = useState(false); // Modal state
  const [isBooked, setIsBooked] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [currentDate, setCurrentDate] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentTime, setCurrentTime] = useState<string>("");
  const [endTime, setEndTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalKPrice, setTotalKPrice] = useState(0);
  const [totalXPrice, setTotalXPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0); // State to track the calculated price
  const router = useRouter();

  const hourlyRate = 5;
  const hourlyKRate = 0.00009;
  const hourlyXRate = 9.42; // Example rate: $8 per hour

  useEffect(() => {
    if (showModal) document.body.classList.add("lock");
    else document.body.classList.remove("lock");
  }, [showModal]);

  useEffect(() => {
    // Set current date and time in the proper format
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; // YYYY-MM-DD format
    const formattedTime = today.toTimeString().slice(0, 5); // HH:MM format

    setCurrentDate(formattedDate);
    setCurrentTime(formattedTime);
  }, []);

  const calculatedXPrice = () => {
    if (!bookingDate || !bookingTime || !endDate || !endTime) {
      return 0;
    }

    const start = new Date(`${bookingDate}T${bookingTime}`);
    const end = new Date(`${endDate}T${endTime}`);
    const durationInHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60); // Duration in hours

    // Ensure the duration is positive
    if (durationInHours > 0) {
      return durationInHours * hourlyXRate;
    }

    return 0;
  };
  const calculatedKPrice = () => {
    if (!bookingDate || !bookingTime || !endDate || !endTime) {
      return 0;
    }

    const start = new Date(`${bookingDate}T${bookingTime}`);
    const end = new Date(`${endDate}T${endTime}`);
    const durationInHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60); // Duration in hours

    // Ensure the duration is positive
    if (durationInHours > 0) {
      return durationInHours * hourlyKRate;
    }

    return 0;
  };

  const calculatePrice = () => {
    if (!bookingDate || !bookingTime || !endDate || !endTime) {
      return 0;
    }

    const start = new Date(`${bookingDate}T${bookingTime}`);
    const end = new Date(`${endDate}T${endTime}`);
    const durationInHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60); // Duration in hours

    // Ensure the duration is positive
    if (durationInHours > 0) {
      return durationInHours * hourlyRate;
    }

    return 0;
  };

  const handleBooking = () => {
    if (!bookingDate || !bookingTime || !endDate || !endTime) {
      alert("Please select a start date, end date, start time, and end time.");
      return;
    }

    // Validate that end date is not before start date
    if (endDate < bookingDate || (endDate === bookingDate && endTime <= bookingTime)) {
      alert("End date and time cannot be before the start date and time.");
      return;
    }

    const calculatedPrice = calculatePrice();
    setTotalPrice(calculatedPrice);
    setTotalKPrice(calculatedKPrice);
    setTotalXPrice(calculatedXPrice);
    setShowModal(true); // Show modal on button click
  };

  const handleConfirmBooking = () => {
    const rental = {
      productTitle: title,
      productId: id,
      bookingDate,
      bookingTime,
      endDate,
      endTime,
      totalPrice,
    };

    // Store the rental in localStorage
    const storedRentals = JSON.parse(localStorage.getItem("rentals") || "[]");
    storedRentals.push(rental);
    localStorage.setItem("rentals", JSON.stringify(storedRentals));

    setIsBooked(true);
    setShowModal(false); // Hide modal after confirmation

    // Redirect to My Rentals after booking
    setTimeout(() => {
      router.push("/myrentals");
    }, 1000); // Delay to allow user to see the confirmation
  };

  return (
    <div className={styles.product_details__description}>
      <div className={styles.product_details__title}>
        <h2>{title}</h2>
        <p className="text-black">{text}</p>
        <div className="my-4">
          <p className="flex flex-wrap gap-[6px] gap-y-0 font-semibold text-black">
            Price: ${hourlyRate} -
            <span className="flex items-center">
              <Image src="data:image/svg+xml;base64,ICA8c3ZnCiAgICAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgICAgd2lkdGg9IjMzIgogICAgICBoZWlnaHQ9IjMzIgogICAgICBmaWxsPSJub25lIgogICAgICB2aWV3Qm94PSIwIDAgMzMgMzMiCiAgICA+CiAgICAgIDxwYXRoCiAgICAgICAgZmlsbD0iI0ZGOTkzMSIKICAgICAgICBkPSJNMTQuMzcgMjkuMzFhMTIuNjcyIDEyLjY3MiAwIDAxLTguOTkzLTMuNzMyIDEyLjcwNyAxMi43MDcgMCAwMS0zLjcyNS05LjAxYzAtMS43Mi4zMzYtMy4zODggMS00Ljk2YTEyLjY5OCAxMi42OTggMCAwMTIuNzI1LTQuMDUgMTIuNjggMTIuNjggMCAwMTguOTkzLTMuNzMxIDEyLjY3MyAxMi42NzMgMCAwMTguOTkzIDMuNzMyIDEyLjcwNyAxMi43MDcgMCAwMTMuNzI1IDkuMDFjMCAxLjcyLS4zMzcgMy4zODgtMSA0Ljk2YTEyLjY5OSAxMi42OTkgMCAwMS0yLjcyNiA0LjA1IDEyLjY4MiAxMi42ODIgMCAwMS04Ljk5MiAzLjczMnoiCiAgICAgID48L3BhdGg+CiAgICAgIDxwYXRoCiAgICAgICAgZmlsbD0iI2ZmZiIKICAgICAgICBkPSJNMTQuMzcgNC4wMTZjNi45MiAwIDEyLjUzIDUuNjIgMTIuNTMgMTIuNTUzIDAgNi45MzMtNS42MSAxMi41NTMtMTIuNTMgMTIuNTUzLTYuOTIgMC0xMi41My01LjYyLTEyLjUzLTEyLjU1MyAwLTYuOTMzIDUuNjEtMTIuNTUzIDEyLjUzLTEyLjU1M3ptMC0uMzc4YTEyLjg2IDEyLjg2IDAgMDAtOS4xMjYgMy43ODcgMTIuODkgMTIuODkgMCAwMC0zLjc4IDkuMTQ0IDEyLjg4OCAxMi44ODggMCAwMDMuNzggOS4xNDMgMTIuODY0IDEyLjg2NCAwIDAwOS4xMjYgMy43ODcgMTIuODYgMTIuODYgMCAwMDkuMTI2LTMuNzg3IDEyLjg5MyAxMi44OTMgMCAwMDMuNzgtOS4xNDNjMC0xLjc0Ni0uMzQyLTMuNDQtMS4wMTUtNS4wMzRhMTIuODkgMTIuODkgMCAwMC0yLjc2Ni00LjExIDEyLjg2NCAxMi44NjQgMCAwMC05LjEyNi0zLjc4N3oiCiAgICAgID48L3BhdGg+CiAgICAgIDxwYXRoCiAgICAgICAgZmlsbD0iIzAwNkUzQyIKICAgICAgICBkPSJNMjkuMzAyIDguNjE3Yy0uNjYtLjI4NC0xLjYyMy0uNjA0LTIuNjctLjY0Mi0uODYyLS4wMzItMS42MzguMTM1LTIuMzA3LjQ5NWEzLjkwOCAzLjkwOCAwIDAwLS4zODguMjRjLTEuMDcxLjc1My0xLjYxOSAxLjk0LTEuODkzIDIuODQ5bC0uMTE3LjM4OS4zNTYtLjE5IDEuODg0LTEuMDExYS43NTMuNzUzIDAgMDExLjAxNS4yOTRsLjAwNS4wMDcuMDEuMDE5YS43MDUuNzA1IDAgMDEuMDMzLjA3bDQuMzQyLTIuNDA5Yy0uMDQtLjAxOC0uMjI4LS4wOTMtLjI3LS4xMTF6IgogICAgICA+PC9wYXRoPgogICAgICA8cGF0aAogICAgICAgIGZpbGw9IiMwNkIyM0MiCiAgICAgICAgZD0iTTI4LjYxNSAxMS41MzNjLTIuMTUyIDMuNTYyLTUuOTg1IDEuNzg4LTUuOTg1IDEuNzg4bDEuMzgzLS43NDNjLjExNS0uMDcuODctLjQ2Ny44Ny0uNDY3LjY2Mi0uNDIxLjI4NS0xLjA3OC4zMTUtMS4wMTRsNC4zNzUtMi4zNjlzLS4wODYgMS4zNi0uOTU5IDIuODA1eiIKICAgICAgPjwvcGF0aD4KICAgICAgPHBhdGgKICAgICAgICBmaWxsPSIjZmZmIgogICAgICAgIGQ9Ik0zMC43NTIgNy42MWMtLjE5LS4xMTEtMS45NC0xLjEwOC00LjA2My0xLjE4NS0xLjEzLS4wNDEtMi4xNjcuMTg4LTMuMDc4LjY4LS4zMDQuMTY0LS41ODEuMzUtLjgzNC41NTMtMS45MTcgMS41MzctMi40MTMgNC4wMjUtMi41NCA1LjEybC0uMDEuMDg2LS4wNzguMDQzLS41NjIuM2MtLjUzOC0uNTUyLTEuMzQtLjk1Ny0xLjk1NC0xLjEyNmwtLjEwOS0uMDMuNTYyLTIuMjQtMS4zMzUtLjM0Ny0uNTU3IDIuMjI1YTI2OC45OCAyNjguOTggMCAwMC0xLjAwNi0uMjdsLjU1NS0yLjIxNi0xLjMzNS0uMzQ2LS41NTMgMi4yMDljLTEuNjItLjQyNS0yLjY1OC0uNjgzLTIuNjU4LS42ODNzLS4yMjMgMS4xMjMtLjMyIDEuMzkzYzAgMCAuMjc1LjA2Ny41NzIuMTU0LjE5NC4wNTcgMS4xNDguMTU5LjgzIDEuMzQ0LS4xNzkuNjY1LTEuMjIgNS4xMjYtMS4zMDIgNS40My0uMDk0LjM1NS0uMTkxLjU1NC0uNjMuNDU2bC0xLjA2NS0uMjM4LS42NjkgMS41OTdjLjI0My4wODMgMS4wODIuMjc4IDIuNjcyLjY4MWwtLjU1MiAyLjIwMyAxLjMzNS4zNDYuNTUzLTIuMjA1Yy4zMTQuMDgxLjY1MS4xNyAxLjAwNy4yNjRsLS41NTIgMi4yMDIgMS4zMzQuMzQ2LjU2Mi0yLjIzOGMxLjU1Mi4yOSAyLjQ0Ny4xOTggMi42NTkuMTU4IDEuMjk2LS4yNCAxLjg0Ny0xLjI0IDIuMDg2LTIuMTkzLjY3My0yLjY4Ni0xLjUzNC0yLjkyMy0xLjI1NS0yLjk4IDEuMjM2LS4yNSAxLjgyNy0xLjQzMyAxLjc2LTIuNDg0bC42My0uMzM3LjA3OS0uMDQzLjA3Ni4wNDJjLjgyNi40MyAyLjEyLjk1NSAzLjU5IDEuMDFhNS43MzQgNS43MzQgMCAwMDIuNjA5LS41Yy4xMTMtLjA1LjIyNC0uMTA2LjMzMi0uMTY1IDMuMTQ5LTEuNjk2IDMuNTU2LTUuODI2IDMuNTkxLTYuMjkxbC4wMzEtLjQ4LS40MDgtLjI0NXptLTEzLjY4IDExLjkxNmMtLjM2NyAxLjQ2NC0yLjg0NS43MjYtMi44NDUuNzI2bC0xLjE3Ny0uMzA1LjczNC0yLjkyOCAxLjQwNi4zNjRzMi4yOTUuNDk4IDEuODgyIDIuMTQzem0uNDQxLTQuMzY0Yy0uMzM3IDEuMzQzLTIuNC43Mi0yLjQuNzJsLS45OC0uMjU0LjY3My0yLjY4NyAxLjE3Mi4zMDRzMS45MTQuNDA4IDEuNTM1IDEuOTE3em0xMi4wMTMtNi4zMTlsLS4wMDIuMDE3Yy0uMjE3IDEuMjE3LS44NTcgMy40MDctMi43IDQuNGExLjE5IDEuMTkgMCAwMS0uMDUuMDI0Yy0uNjMyLjMzLTEuMzQ5LjQ4My0yLjEzMS40NTRhNi4xMyA2LjEzIDAgMDEtMS42My0uMjk1bC0uMzgyLS4xMjIuMzU0LS4xOTEgMS44OTgtMS4wMmEuNzcuNzcgMCAwMC40MDEtLjY1Ni43NzEuNzcxIDAgMDAtLjA4Ni0uMzg3bC0uMDEtLjAyLS4wMDYtLjAwN2EuNzUzLjc1MyAwIDAwLTEuMDE1LS4yOTRsLTEuODg0IDEuMDEtLjM1Ni4xOTEuMTE3LS4zODljLjI3NC0uOTA4LjgyMi0yLjA5NiAxLjg5NC0yLjg0OC4xMjItLjA4Ni4yNTEtLjE2Ni4zODctLjI0LjY2OS0uMzYgMS40NDYtLjUyNyAyLjMwNy0uNDk1IDEuMDQ3LjAzOCAyLjAxLjM1NyAyLjY3LjY0MWwuMTI0LjA1NC4xMTcuMDU4LS4wMTcuMTE1eiIKICAgICAgPjwvcGF0aD4KICAgIDwvc3ZnPg==" alt="xfi" width={15} height={15} /> RBTC {hourlyKRate}
            </span>{" "}
            -
            <span className="flex items-center">
              <Image src="/ripple logo.png" alt="xfi" width={15} height={15} /> XRP {hourlyXRate}
            </span>
            (per hour)
          </p>
          <p className="flex flex-wrap gap-[6px] gap-y-0 font-semibold text-black">
            Total Price: ${totalPrice.toFixed(2)} -
            <span className="flex items-center">
              <Image src="data:image/svg+xml;base64,ICA8c3ZnCiAgICAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgICAgd2lkdGg9IjMzIgogICAgICBoZWlnaHQ9IjMzIgogICAgICBmaWxsPSJub25lIgogICAgICB2aWV3Qm94PSIwIDAgMzMgMzMiCiAgICA+CiAgICAgIDxwYXRoCiAgICAgICAgZmlsbD0iI0ZGOTkzMSIKICAgICAgICBkPSJNMTQuMzcgMjkuMzFhMTIuNjcyIDEyLjY3MiAwIDAxLTguOTkzLTMuNzMyIDEyLjcwNyAxMi43MDcgMCAwMS0zLjcyNS05LjAxYzAtMS43Mi4zMzYtMy4zODggMS00Ljk2YTEyLjY5OCAxMi42OTggMCAwMTIuNzI1LTQuMDUgMTIuNjggMTIuNjggMCAwMTguOTkzLTMuNzMxIDEyLjY3MyAxMi42NzMgMCAwMTguOTkzIDMuNzMyIDEyLjcwNyAxMi43MDcgMCAwMTMuNzI1IDkuMDFjMCAxLjcyLS4zMzcgMy4zODgtMSA0Ljk2YTEyLjY5OSAxMi42OTkgMCAwMS0yLjcyNiA0LjA1IDEyLjY4MiAxMi42ODIgMCAwMS04Ljk5MiAzLjczMnoiCiAgICAgID48L3BhdGg+CiAgICAgIDxwYXRoCiAgICAgICAgZmlsbD0iI2ZmZiIKICAgICAgICBkPSJNMTQuMzcgNC4wMTZjNi45MiAwIDEyLjUzIDUuNjIgMTIuNTMgMTIuNTUzIDAgNi45MzMtNS42MSAxMi41NTMtMTIuNTMgMTIuNTUzLTYuOTIgMC0xMi41My01LjYyLTEyLjUzLTEyLjU1MyAwLTYuOTMzIDUuNjEtMTIuNTUzIDEyLjUzLTEyLjU1M3ptMC0uMzc4YTEyLjg2IDEyLjg2IDAgMDAtOS4xMjYgMy43ODcgMTIuODkgMTIuODkgMCAwMC0zLjc4IDkuMTQ0IDEyLjg4OCAxMi44ODggMCAwMDMuNzggOS4xNDMgMTIuODY0IDEyLjg2NCAwIDAwOS4xMjYgMy43ODcgMTIuODYgMTIuODYgMCAwMDkuMTI2LTMuNzg3IDEyLjg5MyAxMi44OTMgMCAwMDMuNzgtOS4xNDNjMC0xLjc0Ni0uMzQyLTMuNDQtMS4wMTUtNS4wMzRhMTIuODkgMTIuODkgMCAwMC0yLjc2Ni00LjExIDEyLjg2NCAxMi44NjQgMCAwMC05LjEyNi0zLjc4N3oiCiAgICAgID48L3BhdGg+CiAgICAgIDxwYXRoCiAgICAgICAgZmlsbD0iIzAwNkUzQyIKICAgICAgICBkPSJNMjkuMzAyIDguNjE3Yy0uNjYtLjI4NC0xLjYyMy0uNjA0LTIuNjctLjY0Mi0uODYyLS4wMzItMS42MzguMTM1LTIuMzA3LjQ5NWEzLjkwOCAzLjkwOCAwIDAwLS4zODguMjRjLTEuMDcxLjc1My0xLjYxOSAxLjk0LTEuODkzIDIuODQ5bC0uMTE3LjM4OS4zNTYtLjE5IDEuODg0LTEuMDExYS43NTMuNzUzIDAgMDExLjAxNS4yOTRsLjAwNS4wMDcuMDEuMDE5YS43MDUuNzA1IDAgMDEuMDMzLjA3bDQuMzQyLTIuNDA5Yy0uMDQtLjAxOC0uMjI4LS4wOTMtLjI3LS4xMTF6IgogICAgICA+PC9wYXRoPgogICAgICA8cGF0aAogICAgICAgIGZpbGw9IiMwNkIyM0MiCiAgICAgICAgZD0iTTI4LjYxNSAxMS41MzNjLTIuMTUyIDMuNTYyLTUuOTg1IDEuNzg4LTUuOTg1IDEuNzg4bDEuMzgzLS43NDNjLjExNS0uMDcuODctLjQ2Ny44Ny0uNDY3LjY2Mi0uNDIxLjI4NS0xLjA3OC4zMTUtMS4wMTRsNC4zNzUtMi4zNjlzLS4wODYgMS4zNi0uOTU5IDIuODA1eiIKICAgICAgPjwvcGF0aD4KICAgICAgPHBhdGgKICAgICAgICBmaWxsPSIjZmZmIgogICAgICAgIGQ9Ik0zMC43NTIgNy42MWMtLjE5LS4xMTEtMS45NC0xLjEwOC00LjA2My0xLjE4NS0xLjEzLS4wNDEtMi4xNjcuMTg4LTMuMDc4LjY4LS4zMDQuMTY0LS41ODEuMzUtLjgzNC41NTMtMS45MTcgMS41MzctMi40MTMgNC4wMjUtMi41NCA1LjEybC0uMDEuMDg2LS4wNzguMDQzLS41NjIuM2MtLjUzOC0uNTUyLTEuMzQtLjk1Ny0xLjk1NC0xLjEyNmwtLjEwOS0uMDMuNTYyLTIuMjQtMS4zMzUtLjM0Ny0uNTU3IDIuMjI1YTI2OC45OCAyNjguOTggMCAwMC0xLjAwNi0uMjdsLjU1NS0yLjIxNi0xLjMzNS0uMzQ2LS41NTMgMi4yMDljLTEuNjItLjQyNS0yLjY1OC0uNjgzLTIuNjU4LS42ODNzLS4yMjMgMS4xMjMtLjMyIDEuMzkzYzAgMCAuMjc1LjA2Ny41NzIuMTU0LjE5NC4wNTcgMS4xNDguMTU5LjgzIDEuMzQ0LS4xNzkuNjY1LTEuMjIgNS4xMjYtMS4zMDIgNS40My0uMDk0LjM1NS0uMTkxLjU1NC0uNjMuNDU2bC0xLjA2NS0uMjM4LS42NjkgMS41OTdjLjI0My4wODMgMS4wODIuMjc4IDIuNjcyLjY4MWwtLjU1MiAyLjIwMyAxLjMzNS4zNDYuNTUzLTIuMjA1Yy4zMTQuMDgxLjY1MS4xNyAxLjAwNy4yNjRsLS41NTIgMi4yMDIgMS4zMzQuMzQ2LjU2Mi0yLjIzOGMxLjU1Mi4yOSAyLjQ0Ny4xOTggMi42NTkuMTU4IDEuMjk2LS4yNCAxLjg0Ny0xLjI0IDIuMDg2LTIuMTkzLjY3My0yLjY4Ni0xLjUzNC0yLjkyMy0xLjI1NS0yLjk4IDEuMjM2LS4yNSAxLjgyNy0xLjQzMyAxLjc2LTIuNDg0bC42My0uMzM3LjA3OS0uMDQzLjA3Ni4wNDJjLjgyNi40MyAyLjEyLjk1NSAzLjU5IDEuMDFhNS43MzQgNS43MzQgMCAwMDIuNjA5LS41Yy4xMTMtLjA1LjIyNC0uMTA2LjMzMi0uMTY1IDMuMTQ5LTEuNjk2IDMuNTU2LTUuODI2IDMuNTkxLTYuMjkxbC4wMzEtLjQ4LS40MDgtLjI0NXptLTEzLjY4IDExLjkxNmMtLjM2NyAxLjQ2NC0yLjg0NS43MjYtMi44NDUuNzI2bC0xLjE3Ny0uMzA1LjczNC0yLjkyOCAxLjQwNi4zNjRzMi4yOTUuNDk4IDEuODgyIDIuMTQzem0uNDQxLTQuMzY0Yy0uMzM3IDEuMzQzLTIuNC43Mi0yLjQuNzJsLS45OC0uMjU0LjY3My0yLjY4NyAxLjE3Mi4zMDRzMS45MTQuNDA4IDEuNTM1IDEuOTE3em0xMi4wMTMtNi4zMTlsLS4wMDIuMDE3Yy0uMjE3IDEuMjE3LS44NTcgMy40MDctMi43IDQuNGExLjE5IDEuMTkgMCAwMS0uMDUuMDI0Yy0uNjMyLjMzLTEuMzQ5LjQ4My0yLjEzMS40NTRhNi4xMyA2LjEzIDAgMDEtMS42My0uMjk1bC0uMzgyLS4xMjIuMzU0LS4xOTEgMS44OTgtMS4wMmEuNzcuNzcgMCAwMC40MDEtLjY1Ni43NzEuNzcxIDAgMDAtLjA4Ni0uMzg3bC0uMDEtLjAyLS4wMDYtLjAwN2EuNzUzLjc1MyAwIDAwLTEuMDE1LS4yOTRsLTEuODg0IDEuMDEtLjM1Ni4xOTEuMTE3LS4zODljLjI3NC0uOTA4LjgyMi0yLjA5NiAxLjg5NC0yLjg0OC4xMjItLjA4Ni4yNTEtLjE2Ni4zODctLjI0LjY2OS0uMzYgMS40NDYtLjUyNyAyLjMwNy0uNDk1IDEuMDQ3LjAzOCAyLjAxLjM1NyAyLjY3LjY0MWwuMTI0LjA1NC4xMTcuMDU4LS4wMTcuMTE1eiIKICAgICAgPjwvcGF0aD4KICAgIDwvc3ZnPg==" alt="xfi" width={15} height={15} /> RBTC {totalKPrice.toFixed(2)}
            </span>{" "}
            -
            <span className="flex items-center">
              <Image src="/ripple logo.png" alt="xfi" width={15} height={15} /> XRP {totalXPrice.toFixed(2)}
            </span>
          </p>
        </div>
      </div>

      <div className="mb-7 flex items-center gap-7 md4:flex-col md4:items-start md4:gap-0">
        <div className="flex items-center gap-2">
          <CircleUserRound color="#4f4f4f" />
          <span className="text-base font-semibold text-black">Alex Ford</span>
        </div>
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={`mr-[2px] text-xl text-[#ffc107] ${i > 2 ? "text-gray-300" : ""}`}>
              ★
            </span>
          ))}
          <p className="ml-1 text-black">(144)</p>
        </div>
      </div>

      <div className={styles.product_details__condition}>
        <span>
          <label htmlFor="radio1" className="text-black">New</label>
          <input type="radio" id="radio1" name="option" disabled />
        </span>

        <span>
          <label htmlFor="radio2" className="text-black">Used</label>
          <input type="radio" id="radio2" name="option" disabled checked />
        </span>
      </div>

      <div className="m-2 mb-5 flex flex-col items-center justify-center gap-3">
        <label className="w-full text-left font-semibold text-black" htmlFor="bookingDate">
          Start Date
        </label>
        <input
          type="date"
          value={bookingDate}
          min={currentDate}
          onChange={e => setBookingDate(e.target.value)}
          name="bookingDate"
          id="bookingDate"
          className="w-full rounded-lg border-2 border-black px-3 py-1"
        />

        <label className="w-full text-left font-semibold text-black" htmlFor="bookingTime">
          Start Time
        </label>
        <input
          type="time"
          value={bookingTime}
          disabled={!bookingDate}
          onChange={e => setBookingTime(e.target.value)}
          name="bookingTime"
          id="bookingTime"
          className="w-full rounded-lg border-2 border-black px-3 py-1"
        />

        <label className="w-full text-left font-semibold text-black" htmlFor="endDate">
          End Date
        </label>
        <input
          type="date"
          value={endDate}
          disabled={!bookingDate}
          onChange={e => setEndDate(e.target.value)}
          name="endDate"
          id="endDate"
          className="w-full rounded-lg border-2 border-black px-3 py-1"
        />

        <label className="w-full text-left font-semibold text-black" htmlFor="endTime">
          End Time
        </label>
        <input
          type="time"
          value={endTime}
          disabled={!endDate}
          onChange={e => setEndTime(e.target.value)}
          name="endTime"
          id="endTime"
          className="w-full rounded-lg border-2 border-black px-3 py-1"
        />
      </div>

      <button onClick={handleBooking} disabled={isBooked} className="!bg-green-500 hover:!bg-green-500/85">
        <ShoppingCart size={18} color="#fff" />
        <span>{isBooked ? "Already Booked" : "Initiate rental"}</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-80 px-3 py-20">
        <div className="w-full max-w-[500px] rounded-lg bg-gray-800 p-8 shadow-lg">
          <h2 className="mb-4 text-xl font-bold text-white">{title}</h2>
          <p className="mb-4 text-gray-300">{text}</p>
          <div className="mb-4 text-gray-300">
            <p>
              <strong>Start Date:</strong> {bookingDate}
            </p>
            <p>
              <strong>Start Time:</strong> {bookingTime}
            </p>
            <p>
              <strong>End Date:</strong> {endDate}
            </p>
            <p>
              <strong>End Time:</strong> {endTime}
            </p>
            <p className="flex flex-wrap items-center gap-[5px] gap-y-0">
              <strong>Total Price: </strong> 
              <span className="text-white">${totalPrice.toFixed(2)}</span> - 
              <span className="flex items-center">
                <Image src="/k9-logo.png" alt="k9" width={15} height={15} /> K9 
                <span className="text-white">{totalKPrice.toFixed(2)}</span>
              </span> - 
              <span className="flex items-center">
                <Image src="/xfi-logo.png" alt="xfi" width={15} height={15} /> XFI 
                <span className="text-white">{totalXPrice.toFixed(2)}</span>
              </span>
            </p>
          </div>
          <div className="flex justify-end gap-2 md4:flex-col">
            <button
              onClick={() => setShowModal(false)}
              className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmBooking}
              className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            >
              Confirm Booking
            </button>
          </div>
        </div>
      </div>      
      )}
    </div>
  );
};

export default ProductDescription;
