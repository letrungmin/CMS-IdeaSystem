package com.example.CRM1640.enums;

public enum Location {

    GREENWICH_HCM("Greenwich Ho Chi Minh"),
    GREENWICH_HANOI("Greenwich Hanoi"),
    GREENWICH_DANANG("Greenwich Danang"),
    GREENWICH_CANTHO("Greenwich Can Tho"),
    GREENWICH_LONDON("Greenwich Lon Don")
    ;

    private final String displayName;

    Location(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
