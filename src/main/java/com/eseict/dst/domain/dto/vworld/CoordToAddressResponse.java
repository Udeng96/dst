package com.eseict.dst.domain.dto.vworld;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CoordToAddressResponse {

    private Response response;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private Service service;
        private String status;
        private Input input;
        private List<Result> result;

        @Data
        @NoArgsConstructor
        @AllArgsConstructor
        public static class Service {
            private String name;
            private String version;
            private String operation;
            private String time;
        }

        @Data
        @NoArgsConstructor
        @AllArgsConstructor
        public static class Input {
            private Point point;
            private String crs;
            private String type;

            @Data
            @NoArgsConstructor
            @AllArgsConstructor
            public static class Point {
                private String x;
                private String y;
            }
        }

        @Data
        @NoArgsConstructor
        @AllArgsConstructor
        public static class Result {
            private String zipcode;
            private String type;
            private String text;
            private Structure structure;

            @Data
            @NoArgsConstructor
            @AllArgsConstructor
            public static class Structure {
                private String level0;
                private String level1;
                private String level2;
                private String level3;
                private String level4L;
                private String level4LC;
                private String level4A;
                private String level4AC;
                private String level5;
                private String detail;
            }
        }
    }
}
