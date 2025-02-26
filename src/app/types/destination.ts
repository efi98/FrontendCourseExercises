import { Status } from "@types";

export interface Destination {
    destination_id: string;
    destination_name: string;
    status: Status;
    airport_name: string;
    airport_url: string;
    image_url: string;
}