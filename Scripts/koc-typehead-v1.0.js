/// <reference path="_references.js" />

jQuery.fn.extend({
    kocTypeHead: function (opts) {
        return this.each(function () {
            var _self = $(this);
            var dataModel = {
                val: ko.observable(),
                inputFocused: ko.observable(false),
                hint: ko.observable(),
                suggestions: ko.observable([]),
                hilight: function (text) {
                    var regExp = new RegExp(this.val(), "gi");
                    return text.replace(regExp, "<strong>$&</strong>")
                },
                selectedIndex: ko.observable(-1),
                assignedVal: ko.observable(),
                select: function(index){
                    if (index >= 0 && index < this.suggestions().length) this.selectedIndex(index);
                    else this.selectedIndex(-1);
                },
                keyUp: function (data, event) {
                    var increase = 0;
                    switch (event.which) {
                        case 37:
                            break;
                        case 38:
                            increase = -1;
                            break;
                        case 39:
                            this.hint() && this.assignedVal(this.hint()), this.selectedIndex(this.suggestions().indexOf(this.assignedVal()));
                            break;
                        case 40:
                            increase = 1;
                            break;
                        case 13:
                            var index = this.selectedIndex() == -1 ? this.suggestions().indexOf(this.value()):this.selectedIndex();
                            if (index == -1) return false;
                            this.selectedIndex(index);
                            this.assignedVal(this.suggestions()[this.selectedIndex()]);
                            this.val(this.suggestions()[this.selectedIndex()]);
                            this.hilight(this.val());
                            this.hint(null);
                            this.inputFocused(false);
                        default:
                            return true;
                    };
                    if(increase != 0) this.select(this.selectedIndex() + increase);
                    return false;
                }
            }
            dataModel.val.subscribe(function (val) {
                dataModel.hint(null);
                if(dataModel.assignedVal()!=null) return dataModel.assignedVal(null);
                if (!val || val.length < 3) return clearTimeout(dataLoaderTimer), (innerQuery && innerQuery.abort()), dataModel.suggestions([]);
                if (dataLoaderTimer != null) clearTimeout(dataLoaderTimer);
                dataLoaderTimer = setTimeout(function () {
                    loadData(val);
                }, 300);
            });
            dataModel.value = ko.pureComputed({
                read: function () {
                    return this.assignedVal() || this.val();
                },
                write: function (val) {
                    this.val(val);
                },
                owner: dataModel
            });
            dataModel.selectedIndex.subscribe(function (val) {
                _self.find("li.kth-suggestion").removeClass("kth-suggestion-hover");
                $(_self.find("li.kth-suggestion")[val]).addClass("kth-suggestion-hover");
            });
            dataModel.suggestions.subscribe(function () {
                for (var i = 0; i < dataModel.suggestions().length; i++) {
                    if (dataModel.suggestions()[i].indexOf(dataModel.val()) === 0) {
                        dataModel.hint(dataModel.suggestions()[i]);
                        return;
                    }
                }
                dataModel.selectedIndex(-1);
                dataModel.assignedVal(null);
            });
            var dataLoaderTimer = null;
            var options = opts || {};
            var innerQuery = null;
            var createInputHint = function () {
                var inputHint = document.createElement("input");
                inputHint.classList.add("kth-input-hint");
                inputHint.type = "text";
                $(inputHint).attr("data-bind", "value: hint");
                _self.append(inputHint);
            }
            var createInputValue = function () {
                var inputValue = document.createElement("input");
                inputValue.classList.add("kth-input-value");
                inputValue.type = "text";
                $(inputValue).attr("data-bind", "value: value, hasFocus: inputFocused, valueUpdate: 'afterkeydown', event: {keyup: keyUp}");
                _self.append(inputValue);
            }
            var createPreElement = function () {
                var pre = document.createElement("pre");
                $(pre).css({
                    "visibility": "hidden",
                    "font-size": "1.2em",
                    "padding": "0",
                    "margin": "0"
                });
                pre.innerHTML = "&mbsp;";
                _self.append(pre);
            }
            var addSuggestion = function(){        
                var suggestion = document.createElement("li");
                suggestion.classList.add("kth-suggestion");
                _self.find(".kth-suggestions").append(suggestion);
                $(suggestion).attr("data-bind", "html: $parent.hilight(suggestion)");
            }
            var createSuggestions = function () {
                var suggestions = document.createElement("ul");
                suggestions.classList.add("kth-suggestions");
                $(suggestions).attr("data-bind", "foreach: { data: suggestions, as: 'suggestion' }");
                _self.find(".kth-menu").append(suggestions);
                addSuggestion();
            }
            var createMenu = function () {
                var menu = document.createElement("div");
                menu.classList.add("kth-menu");
                $(menu).attr("data-bind", "css: {'kth-menu-open': suggestions().length > 0 && inputFocused}")
                _self.append(menu);
                createSuggestions();
            }
            var create = function () {
                createInputHint();
                createInputValue();
                createPreElement();
                createMenu();
                ko.cleanNode(_self[0]);
                ko.applyBindings(dataModel, _self[0]);
            }
            var loadData = function (key) {
                if (innerQuery != null) innerQuery.abort();
                var options = {}
                for (var attr in opts.dataLoaderParams || {}) {
                    options[attr] = opts.dataLoaderParams[attr];
                }
                options.data = options.data.replace("@Key", key);
                innerQuery = $.ajax(options)
                .done(function (data, textStatus, xhr) {
                    dataModel.suggestions(opts.prepareData(data));
                })
                .error(function (xhr, textStatus, error) {
                })
            }

            create();

            return {
            };
        });
    }
});