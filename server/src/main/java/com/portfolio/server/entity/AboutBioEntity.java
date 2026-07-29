package com.portfolio.server.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "ABOUT_BIO")
public class AboutBioEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob
    @Column(name = "PARAGRAPH_TEXT", nullable = false)
    private String paragraphText;

    @Column(name = "DISPLAY_ORDER")
    private Integer displayOrder;

    public AboutBioEntity() {}

    public AboutBioEntity(String paragraphText, Integer displayOrder) {
        this.paragraphText = paragraphText;
        this.displayOrder = displayOrder;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getParagraphText() { return paragraphText; }
    public void setParagraphText(String paragraphText) { this.paragraphText = paragraphText; }

    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
}
