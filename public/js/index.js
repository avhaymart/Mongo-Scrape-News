/* <div class="card-body">
                <div>
                    <a class="card-title" href="#">Miata Stuff</a>
                    <button href="#" class="btn btn-primary card-link">Save Article</button>
                </div>
                <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
</div> */

const populate = (id, title, link, excerpt, saved) => {
    var card = $("<div>").addClass("card mb-3");
    var cardBody = $("<div>").addClass("card-body").data("id", id);
    var head = $("<div>").addClass("mb-1");
    head.append($("<a>").text(title).attr("href", link))
    if (saved === true) {
        head.append($("<button>").text("Saved!").addClass("btn btn-danger save-article"));
    } else if (saved === false) {
        head.append($("<button>").text("Save Article").addClass("btn btn-primary save-article"));
    }
    cardBody.append(head);
    cardBody.append($("<p>").text(excerpt));
    card.append(cardBody);

    return card;
}

$.ajax({
    type: "GET",
    url: "/api/articles/all"
}).then(function (data) {
    console.log(data)
    data.forEach(i => {
        $("#articleContainer").append(populate(i._id, i.title, i.link, i.excerpt, i.saved))
    });
});

$(document).on("click", ".save-article", function () {
    var id = ($(this).parent().parent().data("id"));
    var self = $(this)
    $.ajax({
        type: "PUT",
        url: `/api/articles/${id}`
    }).then(function (data) {
        if (data === false) {
            console.log("false");
            self.removeClass("btn-danger");
            self.addClass("btn-primary").text("Save Article");
        } else if (data === true) {
            console.log("true");
            self.removeClass("btn-primary");
            self.addClass("btn-danger").text("Saved!");

        }
    })
});